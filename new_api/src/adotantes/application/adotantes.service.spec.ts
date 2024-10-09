import { Test, TestingModule } from '@nestjs/testing';
import { AdotantesService } from './adotantes.service';
import { Adotante } from '../domain/adotante';
import { AdotanteRepository } from './ports/adotantes.repository';
import { PessoaRepository } from '../../pessoas/application/ports/pessoas.repository';
import { PessoaFactory } from '../../pessoas/domain/factories/pessoas-factory';
import { CreateAdotanteDto } from '../presenters/http/dto/create-adotante.dto';
import { UpdateAdotanteDto } from '../presenters/http/dto/update-adotante.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Testando AdotantesService', () => {
  let service: AdotantesService;
  let adotanteRepository: AdotanteRepository;
  let pessoaRepository: PessoaRepository;
  let pessoaFactory: PessoaFactory;

  const mockAdotante = {
    id: 'adotante-id',
    renda: 123.45,
    condicao_entrevista: 'Aprovado',
    pessoa_id: 1,
    nome: 'João Silva',
    cep: '12345-678',
    endereco: 'Rua Teste, 123',
    telefone: ['123456789'],
    email: 'joao@teste.com',
    cpf: '123.456.789-00',
  };

  const mockAdotanteRepository = {
    save: jest.fn().mockResolvedValue(mockAdotante),
    findAll: jest.fn().mockResolvedValue([mockAdotante]),
    findById: jest.fn().mockResolvedValue(mockAdotante),
    update: jest.fn().mockResolvedValue(mockAdotante),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockPessoaRepository = {
    findByCpf: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(mockAdotante),
    update: jest.fn().mockResolvedValue(mockAdotante),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockPessoaFactory = {
    createPerson: jest.fn().mockReturnValue(mockAdotante),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdotantesService,
        {
          provide: AdotanteRepository,
          useValue: mockAdotanteRepository,
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

    service = module.get<AdotantesService>(AdotantesService);
    adotanteRepository = module.get<AdotanteRepository>(AdotanteRepository);
    pessoaRepository = module.get<PessoaRepository>(PessoaRepository);
    pessoaFactory = module.get<PessoaFactory>(PessoaFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new adopter', async () => {
    const dto: CreateAdotanteDto = {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      cep: '12345-678',
      endereco: 'Rua Teste, 123',
      telefone: ['123456789'],
      email: 'joao@teste.com',
      renda: 123.45,
      condicao_entrevista: 'Aprovado',
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockAdotante);
    expect(mockPessoaRepository.findByCpf).toHaveBeenCalledWith(dto.cpf);
    expect(mockPessoaFactory.createPerson).toHaveBeenCalled();
    expect(adotanteRepository.save).toHaveBeenCalledWith(expect.any(Adotante));
  });

  it('should throw BadRequestException if CPF already exists', async () => {
    mockPessoaRepository.findByCpf.mockResolvedValueOnce(mockAdotante);
    const dto: CreateAdotanteDto = {
      ...mockAdotante,
    };

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(mockPessoaRepository.findByCpf).toHaveBeenCalledWith(dto.cpf);
  });

  it('should return an array of adopters', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockAdotante]);
    expect(adotanteRepository.findAll).toHaveBeenCalled();
  });

  it('should return a single adopter by ID', async () => {
    const id = 1;
    const result = await service.findOne(id);
    expect(result).toEqual(mockAdotante);
    expect(adotanteRepository.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException if adopter not found', async () => {
    mockAdotanteRepository.findById.mockResolvedValueOnce(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update an adopter', async () => {
    const id = 1;
    const dto: UpdateAdotanteDto = {
      condicao_entrevista: 'Atualizado',
    };

    const result = await service.update(id, dto);
    expect(result).toEqual({ ...mockAdotante, ...dto });
    expect(adotanteRepository.update).toHaveBeenCalledWith(id, {
      ...mockAdotante,
      ...dto,
    });
  });

  it('should remove an adopter and the associated person', async () => {
    const id = 1;

    const result = await service.remove(id);
    expect(result).toEqual({ deleted: true });
    expect(adotanteRepository.remove).toHaveBeenCalledWith(id);
    expect(pessoaRepository.remove).toHaveBeenCalledWith(mockAdotante.id);
  });
});