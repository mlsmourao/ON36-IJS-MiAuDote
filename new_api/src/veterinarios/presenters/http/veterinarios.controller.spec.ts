import { Test, TestingModule } from '@nestjs/testing';
import { VeterinariosController } from './veterinarios.controller'; 
import { VeterinariosService } from '../../application/veterinarios.service'; 
import { CreateVeterinarioDto } from './dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from './dto/update-veterinario.dto'; 

describe('VeterinariosController', () => {
  let controller: VeterinariosController;
  let service: VeterinariosService;

  const mockVeterinarios = {
    "id": 1,
    "especialidade": "Cardiologia",
    "registro_crmv": "12345-AB",
    "nome": "Dr. João Silva",
    "cep": "12345-678",
    "endereco": "Rua dos Animais, 123",
    "telefone": ["(11) 98765-4321"],
    "email": "dr.joao@veterinaria.com",
    "cpf": "123.456.789-00"
  }
  ;

  const mockVeterinariosService = {
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    findAll: jest.fn(() => [mockVeterinarios]),
    findOne: jest.fn((id) => ({ ...mockVeterinarios, id })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeterinariosController],
      providers: [
        {
          provide: VeterinariosService,
          useValue: mockVeterinariosService,
        },
      ],
    }).compile();

    controller = module.get<VeterinariosController>(VeterinariosController);
    service = module.get<VeterinariosService>(VeterinariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
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

      expect(await controller.create(dto)).toEqual({
        id: expect.any(Number),
        ...dto,
      });

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of veterinarian', async () => {
      expect(await controller.findAll()).toEqual([mockVeterinarios]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a single veterinarian by ID', async () => {
      const id = 1;
      expect(await controller.findOne(id)).toEqual(mockVeterinarios);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update()', () => {
    it('should update an adopter', async () => {
      const id = 1;
      const dto: UpdateVeterinarioDto = {
        "especialidade": "Cardiologia Update",
        "registro_crmv": "12345-AB",
        "nome": "Dr. João Silva",
        "cep": "12345-678",
        "endereco": "Rua dos Animais, 123",
        "telefone": ["(11) 98765-4321"],
        "email": "dr.joao@veterinaria.com",
        "cpf": "123.456.789-00"
      };

      expect(await controller.update(id, dto)).toEqual({
        id,
        ...dto,
      });

      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove()', () => {
    it('should remove an adopter', async () => {
      const id = 1;
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
