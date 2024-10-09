import { Injectable, NotFoundException } from '@nestjs/common';
import { Consumivel } from '../domain/consumivel';
import { CreateConsumivelDto } from '../presenters/http/dto/create-consumivel.dto';
import { UpdateConsumivelDto } from '../presenters/http/dto/update-consumivel.dto';
import { ConsumivelRepository } from './ports/consumiveis.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { CreateGastoDto } from '../../gastos/presenters/http/dto/create-gasto.dto'
import { GastoType } from '../../gastos/domain/enum/gasto.enum';

@Injectable()
export class ConsumiveisService {
  constructor(
    private readonly consumivelRepository: ConsumivelRepository,
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
  ) {}

  async findAll(): Promise<Consumivel[]> {
    return this.consumivelRepository.findAll();
  }

  async findOne(id: number): Promise<Consumivel> {
    const consumivel = await this.consumivelRepository.findById(id);
    if (!consumivel) {
      throw new NotFoundException(`Consumivel with ID ${id} not found`);
    }
    return consumivel;
  }

  async create(createConsumivelDto: CreateConsumivelDto): Promise<Consumivel> {
    
    const gastoData: CreateGastoDto = {
      data_gasto: createConsumivelDto.data_gasto,
      tipo: createConsumivelDto.tipo,
      quantidade: createConsumivelDto.quantidade,
      valor: createConsumivelDto.valor
    };

    const gasto = this.gastoFactory.createGasto(GastoType.Castracao, gastoData, {});
    
    const newConsumivel = new Consumivel(
      gasto.id,
      createConsumivelDto.tipo_animal,
      createConsumivelDto.descricao,
      gasto.id,
      gasto.data_gasto,
      gasto.tipo,
      gasto.quantidade,
      gasto.valor
    );

    return this.consumivelRepository.save(newConsumivel);
  }

  async update(id: number, updateConsumivelDto: UpdateConsumivelDto): Promise<Consumivel> {
    const consumivel = await this.findOne(id);

    const updatedConsumivelData = {
      ...consumivel,
      ...updateConsumivelDto,
    };

    const gasto = await this.gastoRepository.findById(updatedConsumivelData.gasto_id);
    if (!gasto){
      throw new NotFoundException(`Gasto with ID ${updatedConsumivelData.gasto_id} not found`)
    }

    const updatedGastoData = {
      ...gasto,
      data_gasto: updateConsumivelDto.data_gasto ?? gasto.data_gasto,
      tipo: updateConsumivelDto.tipo ?? gasto.tipo,
      quantidade: updateConsumivelDto.quantidade ?? gasto.quantidade,
      valor: updateConsumivelDto.valor ?? gasto.valor
    };

    await this.gastoRepository.update(gasto.id, updatedGastoData);

    const result = await this.consumivelRepository.update(id, updatedConsumivelData);
    if(!result){
      throw new NotFoundException(`Consumivel with ID ${id} not found for update.`)
    }

    return updatedConsumivelData;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const consumivel = await this.findOne(id);
    await this.gastoRepository.remove(consumivel.id);
    await this.consumivelRepository.remove(id);
    return { deleted: true };
  }
}
