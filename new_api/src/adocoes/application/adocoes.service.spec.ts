import { Test, TestingModule } from '@nestjs/testing';
import { AdocoesService } from './adocoes.service';
import { AdocaoRepository } from './ports/adocoes.repository';
import { AnimalRepository } from '../../animais/application/ports/animais.repository';
import { AdotanteRepository } from '../../adotantes/application/ports/adotantes.repository';
import { AdocaoFactory } from '../domain/factories/adocoes-factory';
import { CreateAdocaoDto } from '../presenters/http/dto/create-adocao.dto';
import { Adocao } from '../domain/adocao';
import { Animal } from '../../animais/domain/animal';
import { Adotante } from '../../adotantes/domain/adotante';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('AdocoesService', () => {
  let service: AdocoesService;
  let adocaoRepository: AdocaoRepository;
  let animalRepository: AnimalRepository;
  let adotanteRepository: AdotanteRepository;

  const mockAdocaoRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAnimalRepository = {
    findById: jest.fn(),
    adopt: jest.fn(),
  };

  const mockAdotanteRepository = {
    findById: jest.fn(),
    adopt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdocoesService,
        { provide: AdocaoRepository, useValue: mockAdocaoRepository },
        { provide: AnimalRepository, useValue: mockAnimalRepository },
        { provide: AdotanteRepository, useValue: mockAdotanteRepository },
        AdocaoFactory,
      ],
    }).compile();

    service = module.get<AdocoesService>(AdocoesService);
    adocaoRepository = module.get<AdocaoRepository>(AdocaoRepository);
    animalRepository = module.get<AnimalRepository>(AnimalRepository);
    adotanteRepository = module.get<AdotanteRepository>(AdotanteRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new adoption successfully', async () => {
      const createAdocaoDto: CreateAdocaoDto = {
        data_adocao: new Date(),
        condicoes_especiais: 'Some conditions',
        status_aprovacao: 'Approved',
        animal_id: 1,
        adotante_id: 1,
      };

      const animal: Animal = {
        id: 1,
        nome: 'Rex',
        estado_adocao: 'Disponivel',
      } as Animal;
      const adotante: Adotante = {
        id: 1,
        nome: 'John Doe',
        adocao: [],
      } as Adotante;

      jest.spyOn(animalRepository, 'findById').mockResolvedValue(animal);
      jest.spyOn(adotanteRepository, 'findById').mockResolvedValue(adotante);
      jest
        .spyOn(adocaoRepository, 'save')
        .mockResolvedValue(
          new Adocao(
            1,
            adotante.id,
            animal.id,
            createAdocaoDto.data_adocao,
            createAdocaoDto.condicoes_especiais,
            createAdocaoDto.status_aprovacao,
            animal,
            adotante,
          ),
        );

      const result = await service.create(createAdocaoDto);
      expect(result).toBeDefined();
      expect(adocaoRepository.save).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if animal is not found', async () => {
      const createAdocaoDto: CreateAdocaoDto = {
        data_adocao: new Date(),
        condicoes_especiais: 'Some conditions',
        status_aprovacao: 'Approved',
        animal_id: 1,
        adotante_id: 1,
      };

      jest.spyOn(animalRepository, 'findById').mockResolvedValue(null);

      await expect(service.create(createAdocaoDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException if adotante is not found', async () => {
      const createAdocaoDto: CreateAdocaoDto = {
        data_adocao: new Date(),
        condicoes_especiais: 'Some conditions',
        status_aprovacao: 'Approved',
        animal_id: 1,
        adotante_id: 1,
      };

      const animal: Animal = {
        id: 1,
        nome: 'Rex',
        estado_adocao: 'Disponivel',
      } as Animal;
      jest.spyOn(animalRepository, 'findById').mockResolvedValue(animal);
      jest.spyOn(adotanteRepository, 'findById').mockResolvedValue(null);

      await expect(service.create(createAdocaoDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if the animal is already adopted', async () => {
      const createAdocaoDto: CreateAdocaoDto = {
        data_adocao: new Date(),
        condicoes_especiais: 'Some conditions',
        status_aprovacao: 'Approved',
        animal_id: 1,
        adotante_id: 1,
      };

      const animal: Animal = {
        id: 1,
        nome: 'Rex',
        estado_adocao: 'Adotado',
      } as Animal;
      const adotante: Adotante = {
        id: 1,
        nome: 'John Doe',
        adocao: [],
      } as Adotante;

      jest.spyOn(animalRepository, 'findById').mockResolvedValue(animal);
      jest.spyOn(adotanteRepository, 'findById').mockResolvedValue(adotante);

      await expect(service.create(createAdocaoDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
