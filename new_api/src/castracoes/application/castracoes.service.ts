import { Injectable, NotFoundException } from '@nestjs/common';
import { Castracao } from '../domain/castracao';
import { CreateCastracaoDto } from '../presenters/http/dto/create-castracao.dto';
import { UpdateCastracaoDto } from '../presenters/http/dto/update-castracao.dto';
import { CastracaoRepository } from './ports/castracoes.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { CreateGastoDto } from '../../gastos/presenters/http/dto/create-gasto.dto'
import { GastoType } from '../../gastos/domain/enum/gasto.enum';
import { Veterinario } from '../../veterinarios/domain/veterinarios';
import { VeterinarioRepository } from '../../veterinarios/application/ports/veterinarios.repository';
import { Animal } from '../../animais/domain/animal';
import { AnimalRepository } from '../../animais/application/ports/animais.repository';

@Injectable()
export class CastracoesService {
  constructor(
    private readonly castracaoRepository: CastracaoRepository,
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
    private readonly veterinarioRepository: VeterinarioRepository,
    private readonly animalRepository: AnimalRepository,
  ) {}

  async findAll(): Promise<Castracao[]> {
    return this.castracaoRepository.findAll();
  }

  async findOne(id: number): Promise<Castracao> {
    const castracao = await this.castracaoRepository.findById(id);
    if (!castracao) {
      throw new NotFoundException(`Castracao with ID ${id} not found`);
    }
    return castracao;
  }

  private async findVeterinario(veterinarioId: number): Promise<Veterinario> {
    const veterinario = await this.veterinarioRepository.findById(veterinarioId);
    if (!veterinario) {
      throw new NotFoundException(`Veterinario with ID ${veterinarioId} not found`);
    }
    return veterinario;
  }

  private async findAnimal(animalId: number): Promise<Animal> {
    const animal = await this.animalRepository.findById(animalId);
    if (!animal) {
      throw new NotFoundException(`Animal with ID ${animalId} not found`);
    }
    return animal;
  } 

  async create(createCastracaoDto: CreateCastracaoDto): Promise<Castracao> {

    await this.findVeterinario(createCastracaoDto.veterinario_id);
    await this.findAnimal(createCastracaoDto.animal_id);

    const gastoData: CreateGastoDto = {
      data_gasto: createCastracaoDto.data_gasto,
      tipo: createCastracaoDto.tipo,
      quantidade: createCastracaoDto.quantidade,
      valor: createCastracaoDto.valor
    };
    
    const gasto = this.gastoFactory.createGasto(GastoType.Castracao, gastoData, {});
    
    const newCastracao = new Castracao(
      gasto.id,
      createCastracaoDto.animal_id,
      createCastracaoDto.data_castracao,
      createCastracaoDto.condicao_pos,
      createCastracaoDto.veterinario_id,
      gasto.id,
      gasto.data_gasto,
      gasto.tipo,
      gasto.quantidade,
      gasto.valor
    );

    return this.castracaoRepository.save(newCastracao);
  }

  async update(id: number, updateCastracaoDto: UpdateCastracaoDto): Promise<Castracao> {
    const castracao = await this.findOne(id);

    await this.findVeterinario(updateCastracaoDto.veterinario_id);
    await this.findAnimal(updateCastracaoDto.animal_id);

    const updatedCastracaoData = {
      ...castracao,
      ...updateCastracaoDto,
    };

    const gasto = await this.gastoRepository.findById(updatedCastracaoData.gasto_id);
    if (!gasto){
      throw new NotFoundException(`Gasto with ID ${updatedCastracaoData.gasto_id} not found`)
    }

    const updatedGastoData = {
      ...gasto,
      data_gasto: updateCastracaoDto.data_gasto ?? gasto.data_gasto,
      tipo: updateCastracaoDto.tipo ?? gasto.tipo,
      quantidade: updateCastracaoDto.quantidade ?? gasto.quantidade,
      valor: updateCastracaoDto.valor ?? gasto.valor
    };

    await this.gastoRepository.update(gasto.id, updatedGastoData);

    const result = await this.castracaoRepository.update(id, updatedCastracaoData);
    if(!result){
      throw new NotFoundException(`Castração with ID ${id} not found for update.`)
    }

    return updatedCastracaoData;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const castracao = await this.findOne(id);
    await this.gastoRepository.remove(castracao.id); 
    await this.castracaoRepository.remove(id); 
    return { deleted: true };
  }
}
