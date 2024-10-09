import { Test, TestingModule } from '@nestjs/testing';
import { ConsumiveisController } from '../../presenters/http/consumiveis.controller';
import { ConsumiveisService } from '../../application/consumiveis.service';
import { CreateConsumivelDto } from './dto/create-consumivel.dto';
import { UpdateConsumivelDto } from './dto/update-consumivel.dto';

describe('ConsumiveisController', () => {
  let controller: ConsumiveisController;
  let service: ConsumiveisService;

  const mockConsumiveisService = {
    create: jest.fn((dto: CreateConsumivelDto) => ({
      id: Date.now(),
      ...dto,
      data_gasto: dto.data_gasto || new Date(),
    })),
    findAll: jest.fn(() => [
      {
        id: 1,
        tipo_animal: 'Cachorro',
        descricao: 'Ração',
        gasto_id: 1,
        data_gasto: new Date(),
        tipo: 'Consumível',
        quantidade: 1,
        valor: 123,
      },
    ]),
    findOne: jest.fn((id: number) => ({
      id,
      tipo_animal: 'Cachorro',
      descricao: 'Ração',
      gasto_id: 1,
      data_gasto: new Date(),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    })),
    update: jest.fn((id: number, dto: UpdateConsumivelDto) => ({
      id,
      ...dto,
      data_gasto: dto.data_gasto || new Date(),
    })),
    remove: jest.fn((id: number) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumiveisController],
      providers: [
        {
          provide: ConsumiveisService,
          useValue: mockConsumiveisService,
        },
      ],
    }).compile();

    controller = module.get<ConsumiveisController>(ConsumiveisController);
    service = module.get<ConsumiveisService>(ConsumiveisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new consumivel', async () => {
    const dto: CreateConsumivelDto = {
      tipo_animal: 'Cachorro',
      descricao: 'Ração',
      gasto_id: 1,
      data_gasto: undefined,
      tipo: '',
      quantidade: 0,
      valor: 0,
    };

    const result = await controller.create(dto);
    expect(result).toEqual({
      id: expect.any(Number),
      ...dto,
      data_gasto: expect.any(Date),
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all consumiveis', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        id: 1,
        tipo_animal: 'Cachorro',
        descricao: 'Ração',
        gasto_id: 1,
        data_gasto: expect.any(Date),
        tipo: 'Consumível',
        quantidade: 1,
        valor: 123,
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a consumivel by id', async () => {
    const id = 1;
    const result = await controller.findOne(id);
    expect(result).toEqual({
      id,
      tipo_animal: 'Cachorro',
      descricao: 'Ração',
      gasto_id: 1,
      data_gasto: expect.any(Date),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    });
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a consumivel', async () => {
    const id = 1;
    const dto: UpdateConsumivelDto = {
      tipo_animal: 'Gato',
      descricao: 'Ração',
      gasto_id: 1,
      data_gasto: undefined,
      tipo: '',
      quantidade: 0,
      valor: 0,
    };

    const result = await controller.update(id, dto);
    expect(result).toEqual({
      id,
      ...dto,
      data_gasto: expect.any(Date),
    });
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a consumivel', async () => {
    const id = 1;
    const result = await controller.remove(id);
    expect(result).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
