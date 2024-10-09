import { Test, TestingModule } from '@nestjs/testing';
import { DoadoresService } from './doadores.service';
import { Doador } from '../domain/doadores';
import { DoadorRepository } from './ports/doador.repository';
import { PessoaRepository } from '../../pessoas/application/ports/pessoas.repository';
import { PessoaFactory } from '../../pessoas/domain/factories/pessoas-factory';
import { CreateDoadorDto } from '../presenters/http/dto/create-doador.dto';
import { UpdateDoadorDto } from '../presenters/http/dto/update-doador.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Testando DoadoresService', () => {
  let service: DoadoresService;
  let doadoresRepository: DoadorRepository;
  let pessoaRepository: PessoaRepository;
  let pessoaFactory: PessoaFactory;

  const mockDoador= {
    id: 1,
    tipo_doacao: 'Valor',
    descricao: 'Transferência em Dinheiro',
    doacao: [],
    pessoa_id: 1,
    nome: 'João Silva',
    cep: '12345-678',
    endereco: 'Rua Teste, 123',
    telefone: ['123456789'],
    email: 'joao@teste.com',
    cpf: '123.456.789-00',
  };

  const mockDoadorRepository = {
    save: jest.fn().mockResolvedValue(mockDoador),
    findAll: jest.fn().mockResolvedValue([mockDoador]),
    findById: jest.fn().mockResolvedValue(mockDoador),
    update: jest.fn().mockResolvedValue(mockDoador),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockPessoaRepository = {
    findByCpf: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(mockDoador),
    update: jest.fn().mockResolvedValue(mockDoador),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockPessoaFactory = {
    createPerson: jest.fn().mockReturnValue(mockDoador),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoadoresService,
        {
          provide: DoadorRepository,
          useValue: mockDoadorRepository,
        },
        {
          provide: PessoaRepository,
          useValue: mockPessoaRepository,
        },
        {
          provide: PessoaFactory,
          useValue: mockPessoaFactory,
        },
      ],
    }).compile();

    service = module.get<DoadoresService>(DoadoresService);
    doadoresRepository = module.get<DoadorRepository>(DoadorRepository);
    pessoaRepository = module.get<PessoaRepository>(PessoaRepository);
    pessoaFactory = module.get<PessoaFactory>(PessoaFactory);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new donor', async () => {
    const dto: CreateDoadorDto = {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      cep: '12345-678',
      endereco: 'Rua Teste, 123',
      telefone: ['123456789'],
      email: 'joao@teste.com',
      tipo_doacao: 'Valor',
      descricao: 'Transferência em Dinheiro'
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockDoador);
    expect(mockPessoaRepository.findByCpf).toHaveBeenCalledWith(dto.cpf);
    expect(mockPessoaFactory.createPerson).toHaveBeenCalled();
    expect(doadoresRepository.save).toHaveBeenCalledWith(expect.any(Doador));
  });

  it('should throw BadRequestException if CPF already exists', async () => {
    mockPessoaRepository.findByCpf.mockResolvedValueOnce(mockDoador);
    const dto: CreateDoadorDto = {
      ...mockDoador,
    };

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(mockPessoaRepository.findByCpf).toHaveBeenCalledWith(dto.cpf);
  });

  it('should return an array of donors', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockDoador]);
    expect(doadoresRepository.findAll).toHaveBeenCalled();
  });

  it('should return a single donor by ID', async () => {
    const id = 1;
    const result = await service.findOne(id);
    expect(result).toEqual(mockDoador);
    expect(doadoresRepository.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException if donor not found', async () => {
    mockDoadorRepository.findById.mockResolvedValueOnce(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update an donor', async () => {
    const id = 1;
    const dto: UpdateDoadorDto = {
      descricao: 'Atualizado',
    };

    const result = await service.update(id, dto);
    expect(result).toEqual({ ...mockDoador, ...dto });
    expect(doadoresRepository.update).toHaveBeenCalledWith(id, {
      ...mockDoador,
      ...dto,
    });
  });

  it('should remove an donor and the associated person', async () => {
    const id = 1;

    const result = await service.remove(id);
    expect(result).toEqual({ deleted: true });
    expect(doadoresRepository.remove).toHaveBeenCalledWith(id);
    expect(pessoaRepository.remove).toHaveBeenCalledWith(mockDoador.id);
  });
});