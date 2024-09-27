import { Injectable } from "@nestjs/common";
import { AnimalRepository } from "src/animais/application/ports/animais.repository";
import { Animal } from "src/animais/domain/animal";
import { AnimalEntity } from "../entities/animais.entity";
import { AnimalMapper } from "../mappers/animais.mapper";
import { Vacina } from "src/vacinas/domain/vacinas";

@Injectable()
export class InMemoryAnimalRepository implements AnimalRepository {
    private readonly animais = new Map<number, AnimalEntity>();
    private idCounter = 1;

    async save(animal: Animal): Promise<Animal> {
        const animalEntity = AnimalMapper.paraPersistencia(animal);
        animalEntity.id = this.idCounter++;
        this.animais.set(animalEntity.id, animalEntity);
        console.log(`Animal ${animalEntity.id} criado com sucesso!`);
        return AnimalMapper.paraDominio(animalEntity);
    }

    async findAll(): Promise<Animal[]> {
        console.log("Listando todos as animais...");
        return Array.from(this.animais.values());
    }

    async findById(id: number): Promise<Animal | null> {
        const animal = this.animais.get(id);
        if (animal) {
            console.log(`Animal encontrado: ${animal.nome}`);
            return animal;
        } else {
            console.log(`Animal com ID ${id} não encontrado.`);
            return null;
        }
    }

    async update(id: number, animal: Partial<Animal>): Promise<Animal | null> {
        const existingAnimal = this.animais.get(id);
        if (existingAnimal) {
            const updatedAnimal = { ...existingAnimal, ...animal };
            this.animais.set(id, updatedAnimal);
            console.log(`Animal com ID ${id} atualizado com sucesso!`);
            return updatedAnimal;
        } else {
            console.log(`Animal com ID ${id} não encontrado para atualização.`);
            return null;
        }
    }

    async remove(id: number): Promise<void> {
        if (this.animais.has(id)) {
            this.animais.delete(id);
            console.log(`Animal com ID ${id} removido com sucesso!`);
        } else {
            console.log(`Animal com ID ${id} não encontrado para remoção.`);
        }
    }

    async adopt(animalId: number, adocaoData: any): Promise<void> {
        const existingAnimalEntity = this.animais.get(animalId);
        if (existingAnimalEntity) {
            existingAnimalEntity.estado_adocao = 'Adotado';
            existingAnimalEntity.adocao = adocaoData; // Associa o objeto de adoção

            this.animais.set(animalId, existingAnimalEntity);
            console.log(`Animal com ID ${animalId} adotado com sucesso!`);
        } else {
            console.log(`Animal com ID ${animalId} não encontrado para adoção.`);
        }
    }

    async vaccinate(animalId: number, vacina: Vacina): Promise<Animal | null> {
        const existingAnimalEntity = this.animais.get(animalId);
        if (existingAnimalEntity) {
            const existingAnimal = AnimalMapper.paraDominio(existingAnimalEntity);

            existingAnimal.vacinas.push(vacina);

            const updatedAnimalEntity = AnimalMapper.paraPersistencia(existingAnimal);
            
            this.animais.set(animalId, updatedAnimalEntity);
            console.log(`Animal com ID ${animalId} vacinado com sucesso!`);
            return existingAnimal;
        } else {
            console.log(`Animal com ID ${animalId} não encontrado para vacinação.`);
            return null;
        }
    }

    async medicate(animalId: number, medicamento: any): Promise<Animal | null> {
        const existingAnimalEntity = this.animais.get(animalId);
        if (existingAnimalEntity) {
            const existingAnimal = AnimalMapper.paraDominio(existingAnimalEntity);

            existingAnimal.medicamentos.push(medicamento);

            const updatedAnimalEntity = AnimalMapper.paraPersistencia(existingAnimal);
            
            this.animais.set(animalId, updatedAnimalEntity);
            console.log(`Animal com ID ${animalId} medicado com sucesso!`);
            return existingAnimal;
        } else {
            console.log(`Animal com ID ${animalId} não encontrado para medicação.`);
            return null;
        }
    }

    async castrate(animalId: number, castracaoData: any): Promise<void> {
        const existingAnimalEntity = this.animais.get(animalId);
        if (existingAnimalEntity) {
            existingAnimalEntity.castracao = castracaoData;

            this.animais.set(animalId, existingAnimalEntity);
            console.log(`Animal com ID ${animalId} adotado com sucesso!`);
        } else {
            console.log(`Animal com ID ${animalId} não encontrado para adoção.`);
        }
    }
}
