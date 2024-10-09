import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { Test, TestingModule } from '@nestjs/testing';
import { VacinasService } from './vacinas.service'; 
import { VacinaRepository } from '../application/ports/vacinas.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { CreateVacinaDto } from '../presenters/http/dto/create-vacina.dto';
import { Vacina } from '../domain/vacinas';
import { VeterinarioRepository } from '../../veterinarios/application/ports/veterinarios.repository';
import { Veterinario } from 'src/veterinarios/domain/veterinarios';
import { AnimalRepository } from '../../animais/application/ports/animais.repository';
import { Animal } from 'src/animais/domain/animal';

describe('Testando VacinasService', () => {
  let service: VacinasService;
  let vacinaRepository: VacinaRepository;
  let gastoRepository: GastoRepository;
  let gastoFactory: GastoFactory;
  let veterinarioRepository: VeterinarioRepository;
  let animalRepository: AnimalRepository;

  const mockVacina = {
    id: 1,
    animal_id: 1,
    data_vacinacao: new Date(2019, 1, 1),
    tipo_vacina: 'Raiva',
    veterinario_id: 1,
    data_gasto: new Date(2019, 1, 1),
    tipo: 'Vacinação Obrigatória',
    quantidade: 1,
    valor: 123
  };

  const mockVacinaRepository = {
    save: jest.fn(),
    findAll: jest.fn().mockResolvedValue([mockVacina]),
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
        VacinasService,
        {
          provide: VacinaRepository,
          useValue: mockVacinaRepository,
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

    service = module.get<VacinasService>(VacinasService);
    vacinaRepository = module.get<VacinaRepository>(VacinaRepository);
    gastoRepository = module.get<GastoRepository>(GastoRepository);
    gastoFactory = module.get<GastoFactory>(GastoFactory);
    veterinarioRepository = module.get<VeterinarioRepository>(VeterinarioRepository);
    animalRepository = module.get<AnimalRepository>(AnimalRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vaccine successfully', async () => {
      const dto: CreateVacinaDto = {
        data_gasto: new Date(2019, 1, 1),
        tipo: 'Vacinação Obrigatória',
        valor: 123,
        animal_id: 1,
        veterinario_id: 1,
        gasto_id: 1,
        data_vacinacao: new Date(2019, 1, 1),
        tipo_vacina: 'Raiva',
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

      jest.spyOn(vacinaRepository, 'save').mockResolvedValue(new Vacina(
        1, 
        animal.id,
        dto.data_vacinacao, 
        dto.tipo_vacina, 
        veterinario.id, 
        mockGasto.id, 
        dto.data_gasto, 
        dto.tipo,
        dto.quantidade,
        dto.valor 
      ));

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(vacinaRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of vaccines', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockVacina]);
      expect(mockVacinaRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single vaccine by ID', async () => {
      const id = 1;
      jest.spyOn(mockVacinaRepository, 'findById').mockResolvedValue(mockVacina);
      const result = await service.findOne(id);
      expect(result).toEqual(mockVacina);
      expect(mockVacinaRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should remove a vaccine and the associated expense', async () => {
      const id = 1;
      const result = await service.remove(id);
      expect(result).toEqual({ deleted: true });
      expect(mockVacinaRepository.remove).toHaveBeenCalledWith(id);
      expect(mockGastoRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
