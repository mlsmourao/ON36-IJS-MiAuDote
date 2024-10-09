import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentosController } from '../../presenters/http/medicamentos.controller';
import { MedicamentosService } from '../../application/medicamentos.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

describe('Teste para MedicamentosController', () => {
  let controller: MedicamentosController;
  let service: MedicamentosService;

  const mockMedicamentosService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
        data_compra: dto.data_compra || new Date(),
      };
    }),
    findAll: jest.fn(() => [
      {
        id: 1,
        animal_id: 1,
        data_compra: new Date(),
        descricao: 'Raiva',
        veterinario_id: 1,
        gasto_id: 1,
      },
    ]),
    findOne: jest.fn((id) => ({
      id: 1,
      animal_id: 1,
      data_compra: new Date(),
      descricao: 'Raiva',
      veterinario_id: 1,
      gasto_id: 1,
    })),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
      data_compra: dto.data_compra || new Date(),
    })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicamentosController],
      providers: [
        {
          provide: MedicamentosService,
          useValue: mockMedicamentosService,
        },
      ],
    }).compile();

    controller = module.get<MedicamentosController>(MedicamentosController);
    service = module.get<MedicamentosService>(MedicamentosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new medicine', async () => {
    const dto: CreateMedicamentoDto = {
      animal_id: 1,
      data_compra: new Date(),
      descricao: 'Raiva',
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

  it('should return an array of medicines', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: 1,
        animal_id: 1,
        data_compra: new Date(),
        descricao: 'Raiva',
        veterinario_id: 1,
        gasto_id: 1,
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single medicines by ID', async () => {
    const id = 1;
    expect(await controller.findOne(id)).toEqual({
      id,
      animal_id: 1,
      data_compra: new Date(),
      descricao: 'Raiva',
      veterinario_id: 1,
      gasto_id: 1,
    });

    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update an medicine', async () => {
    const id = 1;
    const dto: UpdateMedicamentoDto = {
      animal_id: 1,
      data_compra: new Date(),
      descricao: 'Updated',
      veterinario_id: 1,
      gasto_id: 1,
    };

    expect(await controller.update(id, dto)).toEqual({
      id,
      ...dto,
    });

    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove an medicine', async () => {
    const id = 1;
    expect(await controller.remove(id)).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
