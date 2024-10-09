import { Test, TestingModule } from '@nestjs/testing';
import { ConsumiveisService } from './consumiveis.service';
import { CreateConsumivelDto } from '../presenters/http/dto/create-consumivel.dto';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { ConsumivelRepository } from './ports/consumiveis.repository';
import { Consumivel } from '../domain/consumivel';

describe('Testando ConsumiveisService', () => {
  let service: ConsumiveisService;
  let consumivelRepository: ConsumivelRepository;
  let gastoRepository: GastoRepository;
  let gastoFactory: GastoFactory;

  const mockConsumivel = {
    id: 1,
    tipo_animal: 'Cachorro',
    descricao: 'Ração',
    gasto_id: 1,
    data_gasto: new Date(2019, 1, 1),
    tipo: 'Consumível',
    quantidade: 1,
    valor: 123,
  };

  const mockConsumivelRepository = {
    save: jest.fn().mockResolvedValue(mockConsumivel),
    findAll: jest.fn().mockResolvedValue([mockConsumivel]),
    findById: jest.fn().mockResolvedValue(mockConsumivel),
    update: jest.fn().mockResolvedValue(mockConsumivel),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockGastoRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  };

  const mockGastoFactory = {
    createGasto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumiveisService,
        GastoFactory,
        {
          provide: ConsumivelRepository,
          useValue: mockConsumivelRepository,
        },
        {
          provide: GastoRepository,
          useValue: mockGastoRepository,
        },
        {
          provide: GastoFactory,
          useValue: mockGastoFactory,
        },
      ],
    }).compile();

    service = module.get<ConsumiveisService>(ConsumiveisService);
    consumivelRepository = module.get<ConsumivelRepository>(ConsumivelRepository);
    gastoRepository = module.get<GastoRepository>(GastoRepository);
    gastoFactory = module.get<GastoFactory>(GastoFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a consumivel', async () => {
    const dto: CreateConsumivelDto = {
      tipo_animal: 'Cachorro',
      descricao: 'Ração',
      gasto_id: 1,
      data_gasto: new Date(2019, 1, 1),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    };

    const mockGasto = {id: 1, ...dto};
    jest.spyOn(gastoRepository, 'save').mockResolvedValue(mockGasto);
    jest.spyOn(gastoFactory, 'createGasto').mockReturnValue(mockGasto);

    jest.spyOn(consumivelRepository, 'save').mockResolvedValue(new Consumivel(
      1,
      dto.tipo_animal,
      dto.descricao,
      mockGasto.id,
      dto.data_gasto,
      dto.tipo,
      dto.quantidade,
      dto.valor
    ));

    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(consumivelRepository.save).toHaveBeenCalled();
  });

  describe('findAll', () => {
  it('should list all consumiveis', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockConsumivel]);
    expect(mockConsumivelRepository.findAll).toHaveBeenCalled();
  });
});

  describe('findOne', () => {
    it('should return a consumivel by ID', async () => {
      const id = 1;
      jest.spyOn(mockConsumivelRepository, 'findById').mockResolvedValue(mockConsumivel);
      const result = await service.findOne(id);
      expect(result).toEqual(mockConsumivel);
      expect(mockConsumivelRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should remove a consumivel', async () => {
      const id = 1;
      const result = await service.remove(id);
      expect(result).toEqual({ deleted: true });
      expect(mockConsumivelRepository.remove).toHaveBeenCalledWith(id);
      expect(mockGastoRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
