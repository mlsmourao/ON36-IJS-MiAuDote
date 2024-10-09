import { Injectable, NotFoundException } from '@nestjs/common';
import { Medicamento } from '../domain/medicamentos';
import { CreateMedicamentoDto } from '../presenters/http/dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from '../presenters/http/dto/update-medicamento.dto';
import { MedicamentoRepository } from './ports/medicamento.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { CreateGastoDto } from '../../gastos/presenters/http/dto/create-gasto.dto';
import { GastoType } from '../../gastos/domain/enum/gasto.enum';

@Injectable()
export class MedicamentosService {
  constructor(
    private readonly medicamentoRepository: MedicamentoRepository,
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
  ) {}

  async findAll(): Promise<Medicamento[]> {
    return this.medicamentoRepository.findAll();
  }

  async findOne(id: number): Promise<Medicamento> {
    const medicamento = await this.medicamentoRepository.findById(id);
    if (!medicamento) {
      throw new NotFoundException(`Medicamento with ID ${id} not found`);
    }
    return medicamento;
  }

  async create(createMedicamentoDto: CreateMedicamentoDto): Promise<Medicamento> {
    const gastoData: CreateGastoDto = {
      data_gasto: createMedicamentoDto.data_gasto,
      tipo: createMedicamentoDto.tipo,
      quantidade: createMedicamentoDto.quantidade,
      valor: createMedicamentoDto.valor
    };
    
    const gasto = this.gastoFactory.createGasto(GastoType.Castracao, gastoData, {});
  
    const newMedicamento = new Medicamento(
      gasto.id,
      createMedicamentoDto.animal_id,
      createMedicamentoDto.data_compra,
      createMedicamentoDto.descricao,
      createMedicamentoDto.veterinario_id,
      gasto.id,
      gasto.data_gasto,
      gasto.tipo,
      gasto.quantidade,
      gasto.valor
    );
    
    return this.medicamentoRepository.save(newMedicamento);
  }

  async update(id: number, updateMedicamentoDto: UpdateMedicamentoDto): Promise<Medicamento> {
    const medicamento = await this.findOne(id);

    const updatedMedicamentoData = {
      ...medicamento,
      ...updateMedicamentoDto
    };

    const gasto = await this.gastoRepository.findById(updatedMedicamentoData.gasto_id);
    if (!gasto){
      throw new NotFoundException(`Gasto with ID ${updatedMedicamentoData.gasto_id} not found`)
    }

    const updatedGastoData = {
      ...gasto,
      data_gasto: updateMedicamentoDto.data_gasto ?? gasto.data_gasto,
      tipo: updateMedicamentoDto.tipo ?? gasto.tipo,
      quantidade: updateMedicamentoDto.quantidade ?? gasto.quantidade,
      valor: updateMedicamentoDto.valor ?? gasto.valor
    };

    await this.gastoRepository.update(gasto.id, updatedGastoData);

    const result = await this.medicamentoRepository.update(id, updatedMedicamentoData);
    if(!result){
      throw new NotFoundException(`Medicamento with ID ${id} not found for update.`)
    }

    return updatedMedicamentoData;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const medicamento = await this.findOne(id);
    await this.gastoRepository.remove(medicamento.id); 
    await this.medicamentoRepository.remove(id); 
    return { deleted: true };
  }
}
