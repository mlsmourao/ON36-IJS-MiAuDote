import { Test, TestingModule } from '@nestjs/testing';
import { VacinasController } from './vacinas.controller';
import { VacinasService } from '../../application/vacinas.service';
import { CreateVacinaDto } from './dto/create-vacina.dto';
import { UpdateVacinaDto } from './dto/update-vacina.dto';

describe('Teste para VacinasController', () => {
  let controller: VacinasController;
  let service: VacinasService;

  const mockVacinasService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
        data_vacinacao: dto.data_vacinacao || new Date(),
      };
    }),
    findAll: jest.fn(() => [
      {
        id: 1,
        animal_id: 1,
        data_vacinacao: new Date(),
        tipo_vacina: 'Raiva',
        veterinario_id: 1,
        gasto_id: 1,
      },
    ]),
    findOne: jest.fn((id) => ({
      id: 1,
      animal_id: 1,
      data_vacinacao: new Date(),
      tipo_vacina: 'Raiva',
      veterinario_id: 1,
      gasto_id: 1,
    })),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
      data_vacinacao: dto.data_vacinacao || new Date(),
    })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacinasController],
      providers: [
        {
          provide: VacinasService,
          useValue: mockVacinasService,
        },
      ],
    }).compile();

    controller = module.get<VacinasController>(VacinasController);
    service = module.get<VacinasService>(VacinasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new vaccine', async () => {
    const dto: CreateVacinaDto = {
      animal_id: 1,
      data_vacinacao: new Date(),
      tipo_vacina: 'Raiva',
      veterinario_id: 1,
      gasto_id: 1,
      data_gasto: undefined,
      tipo: '',
      quantidade: 0,
      valor: 0
    };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of vaccines', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: 1,
        animal_id: 1,
        data_vacinacao: new Date(),
        tipo_vacina: 'Raiva',
        veterinario_id: 1,
        gasto_id: 1,
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single vaccine by ID', async () => {
    const id = 1;
    expect(await controller.findOne(id)).toEqual({
      id,
      animal_id: 1,
      data_vacinacao: new Date(),
      tipo_vacina: 'Raiva',
      veterinario_id: 1,
      gasto_id: 1,
    });

    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update an vaccine', async () => {
    const id = 1;
    const dto: UpdateVacinaDto = {
      animal_id: 1,
      data_vacinacao: new Date(),
      tipo_vacina: 'Updated',
      veterinario_id: 1,
      gasto_id: 1,
    };

    expect(await controller.update(id, dto)).toEqual({
      id,
      ...dto,
    });

    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove an vaccine', async () => {
    const id = 1;
    expect(await controller.remove(id)).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
