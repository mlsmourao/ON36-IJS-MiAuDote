import { Injectable } from '@nestjs/common';
import { AdocaoRepository } from '../../../../../adocoes/application/ports/adocoes.repository';
import { Adocao } from '../../../../../adocoes/domain/adocao';
import { AdocaoEntity } from '../entities/adocao.entity';
import { AdocaoMapper } from '../mappers/adocao.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmAdocaoRepository implements AdocaoRepository {
    constructor(
        @InjectRepository(AdocaoEntity)
        private readonly adocaoRepository: Repository<AdocaoEntity>,
        private readonly adocaoMapper: AdocaoMapper
    ) {}

    async save(adocao: Adocao): Promise<Adocao> {
        const persistenceModel = await this.adocaoMapper.paraPersistencia(adocao);
    
        console.log('persistenceModel:', persistenceModel);
        
        const savedEntity = await this.adocaoRepository.save(persistenceModel);
        
        return this.adocaoMapper.paraDominio(savedEntity);
    }
    

    async findAll(): Promise<Adocao[]> {
        const entities = await this.adocaoRepository.find();
        return Promise.all(entities.map((item) => this.adocaoMapper.paraDominio(item)));
    }

    async findById(id: number): Promise<Adocao | null> {
        const adocaoEncontrada = await this.adocaoRepository.findOne({ where: { id } });
        if (!adocaoEncontrada) return null;
        return this.adocaoMapper.paraDominio(adocaoEncontrada);
    }

    async update(id: number, adocao: Partial<Adocao>): Promise<Adocao | null> {
        const existingAdocaoEntity = await this.adocaoRepository.findOne({ where: { id } });
        if (existingAdocaoEntity) {
            const existingAdocao = this.adocaoMapper.paraDominio(existingAdocaoEntity);

            const updatedAdocao = {
                ...existingAdocao,
                ...adocao,
            };

            const updatedAdocaoEntity = await this.adocaoMapper.paraPersistencia(updatedAdocao);
            await this.adocaoRepository.update(id, updatedAdocaoEntity); 
            console.log(`Adoção com ID ${id} atualizada com sucesso!`);
            return this.adocaoMapper.paraDominio({ ...existingAdocaoEntity, ...updatedAdocaoEntity });
        } else {
            console.log(`Adoção com ID ${id} não encontrada para atualização.`);
            return null;
        }
    }

    async remove(id: number): Promise<void> {
        const result = await this.adocaoRepository.delete(id);
        if (result.affected) {
            console.log(`Adoção com ID ${id} removida com sucesso!`);
        } else {
            console.log(`Adoção com ID ${id} não encontrada para remoção.`);
        }
    }
}
