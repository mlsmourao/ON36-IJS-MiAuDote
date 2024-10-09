import { GastoRepository } from '../application/ports/gasto.repository';
import { Gasto } from '../domain/gastos';
import { Test, TestingModule } from '@nestjs/testing';
import { GastosService } from './gastos.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('Testando GastosService', () => {
  let service: GastosService;
  let gastoRepository: GastoRepository;

  const gasto = new Gasto(
    1,
    new Date(),
    'Medicamento',
    1,
    123.45
  )

  beforeEach(async () => {
    gastoRepository = {
      findAll: jest.fn().mockResolvedValue([gasto]),
      findById: jest.fn().mockResolvedValue(gasto),
      remove: jest.fn().mockResolvedValue(undefined),
    } as unknown as GastoRepository;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GastosService,
        {
          provide: GastoRepository,
          useValue: gastoRepository,
        },
      ],
    }).compile();

    service = module.get<GastosService>(GastosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all people', async () => {
    const gastos = await service.findAll();
    expect(gastos).toHaveLength(1);
    expect(gastos[0]).toBeInstanceOf(Gasto);
    expect(gastos[0].tipo).toBe(gasto.tipo);
  });

  it('should return a person by ID', async () => {
    const foundGasto = await service.findOne(1);
    expect(foundGasto).toBeInstanceOf(Gasto);
    expect(foundGasto.id).toBe(1);
    expect(foundGasto.tipo).toBe(gasto.tipo);
  });

  it('should delete a person', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ deleted: true });
    expect(gastoRepository.remove).toHaveBeenCalledWith(1);
  });

});
