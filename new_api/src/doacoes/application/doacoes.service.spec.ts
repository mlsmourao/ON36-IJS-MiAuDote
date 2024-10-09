import { Test, TestingModule } from '@nestjs/testing';
import { DoacoesService } from './doacoes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doacao } from '../domain/doacoes';
import { Repository } from 'typeorm';
import { CreateDoacaoDto } from '../presenters/http/dto/create-doacao.dto';
import { UpdateDoacaoDto } from '../presenters/http/dto/update-doacao.dto';
import { DoacaoRepository } from './ports/doacao.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';

describe('Testando DoacoesService', () => {
  let service: DoacoesService;
  let doacaoRepository: DoacaoRepository;
  let gastoRepository: GastoRepository;
  let gastoFactory: GastoFactory;

  const mockDoacao = {
    id: 1,
    doador_id: 1,
    data_doacao: new Date(2019, 1, 1),
    tipo_doacao: 'Dinheiro',
    valor_estimado: 100,
    gasto_id: 1,
    data_gasto: new Date(2019, 1, 1),
    tipo: 'Consumível',
    quantidade: 1,
    valor: 123,
  };

  const mockDoacaoRepository = {
    save: jest.fn().mockResolvedValue(mockDoacao),
    findAll: jest.fn().mockResolvedValue([mockDoacao]),
    findById: jest.fn().mockResolvedValue(mockDoacao),
    update: jest.fn().mockResolvedValue(mockDoacao),
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
        DoacoesService,
        GastoFactory,
        {
          provide: DoacaoRepository,
          useValue: mockDoacaoRepository,
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

    service = module.get<DoacoesService>(DoacoesService);
    doacaoRepository = module.get<DoacaoRepository>(DoacaoRepository);
    gastoRepository = module.get<GastoRepository>(GastoRepository);
    gastoFactory = module.get<GastoFactory>(GastoFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new doacao', async () => {
    const dto: CreateDoacaoDto = {
      doador_id: 1,
      data_doacao: new Date(2019, 1, 1),
      tipo_doacao: 'Dinheiro',
      valor_estimado: 100,
      gasto_id: 1,
      data_gasto: new Date(2019, 1, 1),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    };

    const mockGasto = {id: 1, ...dto};
    jest.spyOn(gastoRepository, 'save').mockResolvedValue(mockGasto);
    jest.spyOn(gastoFactory, 'createGasto').mockReturnValue(mockGasto);
    jest.spyOn(doacaoRepository, 'save').mockResolvedValue(new Doacao(
      1,
      dto.doador_id,
      dto.data_doacao,
      dto.tipo_doacao,
      dto.valor_estimado,
      mockGasto.id,
      dto.data_gasto,
      dto.tipo,
      dto.quantidade,
      dto.valor,
    ));

    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(doacaoRepository.save).toHaveBeenCalled();
  });

  describe('find All', () => {
    it('should return all doacoes', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockDoacao]);
      expect(doacaoRepository.findAll).toHaveBeenCalled();
    });
  })

  describe('findOne', () => {
    it('should return a doacao by ID', async () => {
      const id = 1;
      jest.spyOn(mockDoacaoRepository, 'findById').mockResolvedValue(mockDoacao);
      const result = await service.findOne(id);
      expect(result).toEqual(mockDoacao);
      expect(mockDoacaoRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should remove a doacao', async () => {
      const id = 1;
      const result = await service.remove(id);
      expect(result).toEqual({ deleted: true });
      expect(mockDoacaoRepository.remove).toHaveBeenCalledWith(id);
      expect(mockGastoRepository.remove).toHaveBeenCalledWith(id);
    });
  })
});



