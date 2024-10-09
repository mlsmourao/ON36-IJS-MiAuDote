import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { Test, TestingModule } from '@nestjs/testing';
import { CastracoesService } from './castracoes.service';
import { CastracaoRepository } from './ports/castracoes.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { CreateCastracaoDto } from '../presenters/http/dto/create-castracao.dto';
import { Castracao } from '../domain/castracao';
import { VeterinarioRepository } from '../../veterinarios/application/ports/veterinarios.repository';
import { Veterinario } from 'src/veterinarios/domain/veterinarios';
import { AnimalRepository } from '../../animais/application/ports/animais.repository';
import { Animal } from 'src/animais/domain/animal';

describe('Testando CastracoesService', () => {
  let service: CastracoesService;
  let castracaoRepository: CastracaoRepository;
  let gastoRepository: GastoRepository;
  let gastoFactory: GastoFactory;
  let veterinarioRepository: VeterinarioRepository;
  let animalRepository: AnimalRepository;

  const mockCastracao = {
    id: 1,
    animal_id: 1,
    data_castracao: new Date(2019, 1, 1),
    condicao_pos: 'Recuperando',
    veterinario_id: 1,
    data_gasto: new Date(2019, 1, 1),
    tipo: 'Cirurgia',
    quantidade: 1,
    valor: 123
  };

  const mockCastracaoRepository = {
    save: jest.fn(),
    findAll: jest.fn().mockResolvedValue([mockCastracao]),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValue(null),
  };

  const mockGastoRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(), 
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGastoFactory = {
    createGasto: jest.fn(),
  };

  const mockVeterinarioRepository = {
    findById: jest.fn(),
    castrate: jest.fn(),
  };

  const mockAnimalRepository = {
    findById: jest.fn(),
    castrate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CastracoesService,
        {
          provide: CastracaoRepository,
          useValue: mockCastracaoRepository,
        },
        {
          provide: GastoRepository,
          useValue: mockGastoRepository,
        },
        {
          provide: GastoFactory,
          useValue: mockGastoFactory,
        },
        {
          provide: VeterinarioRepository,
          useValue: mockVeterinarioRepository,
        },
        {
          provide: AnimalRepository,
          useValue: mockAnimalRepository,
        }
      ],
    }).compile();

    service = module.get<CastracoesService>(CastracoesService);
    castracaoRepository = module.get<CastracaoRepository>(CastracaoRepository);
    gastoRepository = module.get<GastoRepository>(GastoRepository);
    gastoFactory = module.get<GastoFactory>(GastoFactory);
    veterinarioRepository = module.get<VeterinarioRepository>(VeterinarioRepository);
    animalRepository = module.get<AnimalRepository>(AnimalRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new castration successfully', async () => {
      const dto: CreateCastracaoDto = {
        data_gasto: new Date(2019, 1, 1),
        tipo: 'Cirurgia',
        valor: 123,
        animal_id: 1,
        veterinario_id: 1,
        gasto_id: 1,
        data_castracao: new Date(2019, 1, 1),
        condicao_pos: 'Recuperando',
        quantidade: 1,
      };

      const animal: Animal = {
        id: 1,
        nome: 'Rex',
      } as Animal;
      const veterinario: Veterinario = {
        id: 1,
        nome: 'Dr. Veterinário',
        castracoes: [],
      } as Veterinario;

      jest.spyOn(animalRepository, 'findById').mockResolvedValue(animal);
      jest.spyOn(veterinarioRepository, 'findById').mockResolvedValue(veterinario);

      const mockGasto = { id: 1, ...dto }; 
      jest.spyOn(gastoRepository, 'save').mockResolvedValue(mockGasto);
      jest.spyOn(gastoFactory, 'createGasto').mockReturnValue(mockGasto);

      jest.spyOn(castracaoRepository, 'save').mockResolvedValue(new Castracao(
        1, 
        animal.id,
        dto.data_castracao, 
        dto.condicao_pos, 
        veterinario.id, 
        mockGasto.id, 
        dto.data_gasto, 
        dto.tipo,
        dto.quantidade,
        dto.valor 
      ));

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(castracaoRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of castrations', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCastracao]);
      expect(mockCastracaoRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single castration by ID', async () => {
      const id = 1;
      jest.spyOn(mockCastracaoRepository, 'findById').mockResolvedValue(mockCastracao);
      const result = await service.findOne(id);
      expect(result).toEqual(mockCastracao);
      expect(mockCastracaoRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should remove a castration and the associated expense', async () => {
      const id = 1;
      const result = await service.remove(id);
      expect(result).toEqual({ deleted: true });
      expect(mockCastracaoRepository.remove).toHaveBeenCalledWith(id);
      expect(mockGastoRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
