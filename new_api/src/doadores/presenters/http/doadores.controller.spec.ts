import { Test, TestingModule } from '@nestjs/testing';
import { DoadoresController } from '../../presenters/http/doadores.controller';
import { DoadoresService } from '../../application/doadores.service';
import { CreateDoadorDto } from './dto/create-doador.dto';
import { UpdateDoadorDto } from './dto/update-doador.dto';

describe('DoadoresController', () => {
  let controller: DoadoresController;
  let service: DoadoresService;

  const mockDoador = {
    id: 1,
    tipo_doacao: 'Valor',
    descricao: 'Transferencia de Dinheiro',
    doacao: [],
    nome: 'John Doe',
    cep: '12345-678',
    endereco: 'Rua Exemplo',
    telefone: ['123456789'],
    email: 'johndoe@example.com',
    cpf: '123.456.789-00',
  };

  const mockDoadoresService = {
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    findAll: jest.fn(() => [mockDoador]),
    findOne: jest.fn((id) => ({ ...mockDoador, id })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoadoresController],
      providers: [
        {
          provide: DoadoresService,
          useValue: mockDoadoresService,
        },
      ],
    }).compile();

    controller = module.get<DoadoresController>(DoadoresController);
    service = module.get<DoadoresService>(DoadoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new donor', async () => {
      const dto: CreateDoadorDto = {
        nome: 'John Doe',
        cep: '12345-678',
        endereco: 'Rua Exemplo',
        telefone: ['123456789'],
        email: 'johndoe@example.com',
        cpf: '123.456.789-00',
        tipo_doacao: 'Valor',
        descricao: 'Transferencia de Dinheiro',
      };

      expect(await controller.create(dto)).toEqual({
        id: expect.any(Number),
        ...dto,
      });

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of donors', async () => {
      expect(await controller.findAll()).toEqual([mockDoador]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a single donor by ID', async () => {
      const id = 1;
      expect(await controller.findOne(id)).toEqual(mockDoador);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update()', () => {
    it('should update an donor', async () => {
      const id = 1;
      const dto: UpdateDoadorDto = {
        tipo_doacao: 'Valor',
        descricao: 'Updated',
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
    it('should remove an donor', async () => {
      const id = 1;
      expect(await controller.remove(id)).toEqual({ id });
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
