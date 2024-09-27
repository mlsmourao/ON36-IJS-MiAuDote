import { Injectable } from "@nestjs/common";
import { VeterinarioRepository } from "src/veterinarios/application/ports/veterinarios.repository";
import { Veterinario } from "src/veterinarios/domain/veterinarios";
import { VeterinarioEntity } from "../entities/veterinario.entity";
import { VeterinarioMapper } from "../mappers/veterinario.mapper";
import { Vacina } from "src/vacinas/domain/vacinas";


@Injectable()
export class InMemoryVeterinarioRepository implements VeterinarioRepository {
    private readonly veterinarios = new Map<number, VeterinarioEntity>();
    private idCounter = 1;

    async save(veterinario: Veterinario): Promise<Veterinario> {
        const veterinarioEntity = VeterinarioMapper.paraPersistencia(veterinario);
        veterinarioEntity.id = this.idCounter++;
        this.veterinarios.set(veterinarioEntity.id, veterinarioEntity);
        console.log(`Veterinario ${veterinarioEntity.id} criado com sucesso!`);
        return VeterinarioMapper.paraDominio(veterinarioEntity);
    }

    async findAll(): Promise<Veterinario[]> {
        console.log("Listando todos os veterinario...");
        return Array.from(this.veterinarios.values());
    }

    async findById(id: number): Promise<Veterinario | null> {
        const veterinario = this.veterinarios.get(id);
        if (veterinario) {
            console.log(`Veterinario encontrado: ${veterinario.id}`);
            return veterinario;
        } else {
            console.log(`Veterinario com ID ${id} não encontrado.`);
            return null;
        }
    }

    async update(id: number, veterinario: Partial<Veterinario>): Promise<Veterinario | null> {
        const existingVeterinario = this.veterinarios.get(id);
        if (existingVeterinario) {
            const updatedAdotante = { ...existingVeterinario, ...veterinario } as VeterinarioEntity;
            this.veterinarios.set(id, updatedAdotante);
            console.log(`Veterinario com ID ${id} atualizado com sucesso!`);
            return updatedAdotante;
        } else {
            console.log(`Veterinario com ID ${id} não encontrada para atualização.`);
            return null;
        }
    }

    async remove(id: number): Promise<void> {
        if (this.veterinarios.has(id)) {
            this.veterinarios.delete(id);
            console.log(`Veterinario com ID ${id} removido com sucesso!`);
        } else {
            console.log(`Veterinario com ID ${id} não encontrado para remoção.`);
        }
    }

    async vaccinate(id: number, vacina: Vacina): Promise<Veterinario | null> {
        const existingVeterinarioEntity = this.veterinarios.get(id);
        if (existingVeterinarioEntity) {
            const existingVeterinario = VeterinarioMapper.paraDominio(existingVeterinarioEntity);

            existingVeterinario.vacinas.push(vacina);

            const updatedVeterinarioEntity = VeterinarioMapper.paraPersistencia(existingVeterinario);

            this.veterinarios.set(id, updatedVeterinarioEntity);
            return existingVeterinario;
        } else {
            console.log(`Veterinario com ID ${id} não encontrado para vacinação.`);
            return null;
        }
    }

    async medicate(id: number, medicamento: any): Promise<Veterinario | null> {
        const existingVeterinarioEntity = this.veterinarios.get(id);
        if (existingVeterinarioEntity) {
            const existingVeterinario = VeterinarioMapper.paraDominio(existingVeterinarioEntity);

            existingVeterinario.medicamentos.push(medicamento);

            const updatedVeterinarioEntity = VeterinarioMapper.paraPersistencia(existingVeterinario);

            this.veterinarios.set(id, updatedVeterinarioEntity);
            return existingVeterinario;
        } else {
            console.log(`Veterinario com ID ${id} não encontrado para medicação.`);
            return null;
        }
    }

    async castrate(id: number, castracao: any): Promise<Veterinario | null> {
        const existingVeterinarioEntity = this.veterinarios.get(id);
        if (existingVeterinarioEntity) {
            const existingVeterinario = VeterinarioMapper.paraDominio(existingVeterinarioEntity);

            existingVeterinario.castracoes.push(castracao);

            const updatedVeterinarioEntity = VeterinarioMapper.paraPersistencia(existingVeterinario);

            this.veterinarios.set(id, updatedVeterinarioEntity);
            return existingVeterinario;
        } else {
            console.log(`Veterinario com ID ${id} não encontrado para castração.`);
            return null;
        }
    }

}