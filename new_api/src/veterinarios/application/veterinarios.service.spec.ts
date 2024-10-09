import { Test, TestingModule } from '@nestjs/testing';
import { VeterinariosService } from './veterinarios.service';
import { Veterinario } from '../domain/veterinarios';
import { VeterinarioRepository } from '../application/ports/veterinarios.repository';
import { PessoaRepository } from '../../pessoas/application/ports/pessoas.repository';
import { PessoaFactory } from '../../pessoas/domain/factories/pessoas-factory';
import { CreateVeterinarioDto } from '../presenters/http/dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from '../presenters/http/dto/update-veterinario.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('Testando VeterinariosService', () => {
  let service: VeterinariosService;
  let veterinarioRepository: VeterinarioRepository;
  let pessoaRepository: PessoaRepository;
  let pessoaFactory: PessoaFactory;

  const mockVeterinario = {
    "id": 1,
    "especialidade": "Cardiologia",
    "registro_crmv": "12345-AB",
    "nome": "Dr. João Silva",
    "cep": "12345-678",
    "endereco": "Rua dos Animais, 123",
    "telefone": ["(11) 98765-4321"],
    "email": "dr.joao@veterinaria.com",
    "cpf": "123.456.789-00"
  };

  const mockVeterinarioRepository = {
    save: jest.fn().mockResolvedValue(mockVeterinario),
    findAll: jest.fn().mockResolvedValue([mockVeterinario]),
    findById: jest.fn().mockResolvedValue(mockVeterinario),
    update: jest.fn().mockResolvedValue(mockVeterinario),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockPessoaRepository = {
    findByCpf: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(mockVeterinario),
    update: jest.fn().mockResolvedValue(mockVeterinario),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockPessoaFactory = {
    createPerson: jest.fn().mockReturnValue(mockVeterinario),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VeterinariosService,
        {
          provide: VeterinarioRepository,
          useValue: mockVeterinarioRepository,
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

    service = module.get<VeterinariosService>(VeterinariosService);
    veterinarioRepository = module.get<VeterinarioRepository>(VeterinarioRepository);
    pessoaRepository = module.get<PessoaRepository>(PessoaRepository);
    pessoaFactory = module.get<PessoaFactory>(PessoaFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new veterinarian', async () => {
    const dto: CreateVeterinarioDto = {
      "especialidade": "Cardiologia",
      "registro_crmv": "12345-AB",
      "nome": "Dr. João Silva",
      "cep": "12345-678",
      "endereco": "Rua dos Animais, 123",
      "telefone": ["(11) 98765-4321"],
      "email": "dr.joao@veterinaria.com",
      "cpf": "123.456.789-00"
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockVeterinario);
    expect(mockPessoaRepository.findByCpf).toHaveBeenCalledWith(dto.cpf);
    expect(mockPessoaFactory.createPerson).toHaveBeenCalled();
    expect(veterinarioRepository.save).toHaveBeenCalledWith(expect.any(Veterinario));
  });

  it('should throw BadRequestException if CPF already exists', async () => {
    mockPessoaRepository.findByCpf.mockResolvedValueOnce(mockVeterinario);
    const dto: CreateVeterinarioDto = {
      ...mockVeterinario,
    };

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(mockPessoaRepository.findByCpf).toHaveBeenCalledWith(dto.cpf);
  });

  it('should return an array of veterinarians', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockVeterinario]);
    expect(veterinarioRepository.findAll).toHaveBeenCalled();
  });

  it('should return a single veterinarian by ID', async () => {
    const id = 1;
    const result = await service.findOne(id);
    expect(result).toEqual(mockVeterinario);
    expect(veterinarioRepository.findById).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException if veterinarian not found', async () => {
    mockVeterinarioRepository.findById.mockResolvedValueOnce(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update an veterinarian', async () => {
    const id = 1;
    const dto: UpdateVeterinarioDto = {
      especialidade: 'Cardiologia Updated',
    };

    const result = await service.update(id, dto);
    expect(result).toEqual({ ...mockVeterinario, ...dto });
    expect(veterinarioRepository.update).toHaveBeenCalledWith(id, {
      ...mockVeterinario,
      ...dto,
    });
  });

  it('should remove an veterinarian and the associated person', async () => {
    const id = 1;

    const result = await service.remove(id);
    expect(result).toEqual({ deleted: true });
    expect(veterinarioRepository.remove).toHaveBeenCalledWith(id);
    expect(pessoaRepository.remove).toHaveBeenCalledWith(mockVeterinario.id);
  });
});
