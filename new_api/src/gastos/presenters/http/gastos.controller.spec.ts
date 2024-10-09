import { Test, TestingModule } from '@nestjs/testing';
import { GastosController } from '../../presenters/http/gastos.controller';
import { GastosService } from '../../application/gastos.service';

describe('GastosController', () => {
  let controller: GastosController;
  let service: GastosService;

  const mockDateString = '2024-10-09T01:49:08.751Z'; 

  const mockGastosService = {
    findAll: jest.fn().mockResolvedValue([{
      id: 1,
      data_gasto: mockDateString,
      tipo: 'Medicamento',
      quantidade: 1,
      valor: 123.45,
    }]),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      data_gasto: mockDateString, 
      tipo: 'Medicamento',
      quantidade: 1,
      valor: 123.45,
    }),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GastosController],
      providers: [
        {
          provide: GastosService,
          useValue: mockGastosService,
        },
      ],
    }).compile();

    controller = module.get<GastosController>(GastosController);
    service = module.get<GastosService>(GastosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all gastos', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{
      id: 1,
      data_gasto: mockDateString, 
      tipo: 'Medicamento',
      quantidade: 1,
      valor: 123.45,
    }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one gasto by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({
      id: 1,
      data_gasto: mockDateString,
      tipo: 'Medicamento',
      quantidade: 1,
      valor: 123.45,
    });

    expect(service.findOne).toHaveBeenCalledWith(1);
  });
});
