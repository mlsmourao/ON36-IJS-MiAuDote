import { AnimalFactory } from './../domain/factories/animais-factory';
import { Injectable, NotFoundException } from "@nestjs/common";
import { AnimalRepository } from "./ports/animais.repository";
import { Animal } from '../domain/animal';
import { CreateAnimalDto } from '../presenters/http/dto/create-animal.dto';
import { UpdateAnimalDto } from '../presenters/http/dto/update-animal.dto';

@Injectable()
export class AnimaisService {
  constructor (
    private readonly animalRepository: AnimalRepository,
    private readonly animalFactory: AnimalFactory,
  ) {}
  
  async findAll(): Promise<Animal[]> {
    return this.animalRepository.findAll();
  }

  async findOne(id: number): Promise<Animal> {
    const animal = await this.animalRepository.findById(id);
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }
    return animal;
  }

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    const newAnimal = this.animalFactory.create(createAnimalDto);
    return this.animalRepository.save(newAnimal);
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);

    const updatedAnimalData = {
      nome: updateAnimalDto.nome ?? animal.nome,
      especie: updateAnimalDto.especie ?? animal.especie,
      sexo: updateAnimalDto.sexo ?? animal.sexo,
      data_nascimento: updateAnimalDto.data_nascimento ?? animal.data_nascimento,
      condicao_saude: updateAnimalDto.condicao_saude ?? animal.condicao_saude,
      estado_adocao: updateAnimalDto.estado_adocao ?? animal.estado_adocao,
    };

    const updatedAnimal = this.animalFactory.create(updatedAnimalData);

    await this.animalRepository.update(id, updatedAnimal);
    return updatedAnimal;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.animalRepository.remove(id);
    return { deleted: true };
  }
}