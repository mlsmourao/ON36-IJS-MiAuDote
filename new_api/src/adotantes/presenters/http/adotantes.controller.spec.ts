import { Test, TestingModule } from '@nestjs/testing';
import { AdotantesController } from './adotantes.controller';
import { AdotantesService } from '../../application/adotantes.service';
import { CreateAdotanteDto } from './dto/create-adotante.dto';
import { UpdateAdotanteDto } from './dto/update-adotante.dto';

describe('AdotantesController', () => {
  let controller: AdotantesController;
  let service: AdotantesService;

  const mockAdotante = {
    id: 1,
    renda: 123.45,
    condicao_entrevista: 'Aprovado',
    nome: 'John Doe',
    cep: '12345-678',
    endereco: 'Rua Exemplo',
    telefone: ['123456789'],
    email: 'johndoe@example.com',
    cpf: '123.456.789-00',
  };

  const mockAdotantesService = {
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    findAll: jest.fn(() => [mockAdotante]),
    findOne: jest.fn((id) => ({ ...mockAdotante, id })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdotantesController],
      providers: [
        {
          provide: AdotantesService,
          useValue: mockAdotantesService,
        },
      ],
    }).compile();

    controller = module.get<AdotantesController>(AdotantesController);
    service = module.get<AdotantesService>(AdotantesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new adopter', async () => {
      const dto: CreateAdotanteDto = {
        nome: 'John Doe',
        cep: '12345-678',
        endereco: 'Rua Exemplo',
        telefone: ['123456789'],
        email: 'johndoe@example.com',
        cpf: '123.456.789-00',
        renda: 123.45,
        condicao_entrevista: 'Aprovado',
      };

      expect(await controller.create(dto)).toEqual({
        id: expect.any(Number),
        ...dto,
      });

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of adopters', async () => {
      expect(await controller.findAll()).toEqual([mockAdotante]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a single adopter by ID', async () => {
      const id = 1;
      expect(await controller.findOne(id)).toEqual(mockAdotante);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update()', () => {
    it('should update an adopter', async () => {
      const id = 1;
      const dto: UpdateAdotanteDto = {
        renda: 200.0,
        condicao_entrevista: 'Updated',
        nome: 'John Doe',
        cep: '12345-678',
        endereco: 'Rua Exemplo',
        telefone: ['123456789'],
        email: 'johndoe@example.com',
        cpf: '123.456.789-00',
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
