import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentosService } from './medicamentos.service';
import { MedicamentoRepository } from '../application/ports/medicamento.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { CreateMedicamentoDto } from '../presenters/http/dto/create-medicamento.dto';
import { Medicamento } from '../domain/medicamentos';
import { VeterinarioRepository } from '../../veterinarios/application/ports/veterinarios.repository';
import { Veterinario } from 'src/veterinarios/domain/veterinarios';
import { AnimalRepository } from '../../animais/application/ports/animais.repository';
import { Animal } from 'src/animais/domain/animal';

describe('Testando MedicamentosService', () => {
  let service: MedicamentosService;
  let medicamentoRepository: MedicamentoRepository;
  let gastoRepository: GastoRepository;
  let gastoFactory: GastoFactory;
  let veterinarioRepository: VeterinarioRepository;
  let animalRepository: AnimalRepository;

  const mockMedicamento = {
    id: 1,
    animal_id: 1,
    data_compra: new Date(2019, 1, 1),
    descricao: 'Bravecto',
    veterinario_id: 1,
    data_gasto: new Date(2019, 1, 1),
    tipo: 'Medicação Básica',
    quantidade: 1,
    valor: 123
  };

  const mockMedicamentoRepository = {
    save: jest.fn(),
    findAll: jest.fn().mockResolvedValue([mockMedicamento]),
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
        MedicamentosService,
        {
          provide: MedicamentoRepository,
          useValue: mockMedicamentoRepository,
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

    service = module.get<MedicamentosService>(MedicamentosService);
    medicamentoRepository = module.get<MedicamentoRepository>(MedicamentoRepository);
    gastoRepository = module.get<GastoRepository>(GastoRepository);
    gastoFactory = module.get<GastoFactory>(GastoFactory);
    veterinarioRepository = module.get<VeterinarioRepository>(VeterinarioRepository);
    animalRepository = module.get<AnimalRepository>(AnimalRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new medicine successfully', async () => {
      const dto: CreateMedicamentoDto = {
        data_gasto: new Date(2019, 1, 1),
        tipo: 'Medicação Básica',
        valor: 123,
        animal_id: 1,
        veterinario_id: 1,
        gasto_id: 1,
        data_compra: new Date(2019, 1, 1),
        descricao: 'Bravecto',
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

      jest.spyOn(medicamentoRepository, 'save').mockResolvedValue(new Medicamento(
        1, 
        animal.id,
        dto.data_compra, 
        dto.descricao, 
        veterinario.id, 
        mockGasto.id, 
        dto.data_gasto, 
        dto.tipo,
        dto.quantidade,
        dto.valor 
      ));

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(medicamentoRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of medicines', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockMedicamento]);
      expect(mockMedicamentoRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single medicine by ID', async () => {
      const id = 1;
      jest.spyOn(mockMedicamentoRepository, 'findById').mockResolvedValue(mockMedicamento);
      const result = await service.findOne(id);
      expect(result).toEqual(mockMedicamento);
      expect(mockMedicamentoRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should remove a medicine and the associated expense', async () => {
      const id = 1;
      const result = await service.remove(id);
      expect(result).toEqual({ deleted: true });
      expect(mockMedicamentoRepository.remove).toHaveBeenCalledWith(id);
      expect(mockGastoRepository.remove).toHaveBeenCalledWith(id);
    });
  });
});
