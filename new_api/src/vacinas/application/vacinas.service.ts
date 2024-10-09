import { Injectable, NotFoundException } from '@nestjs/common';
import { Vacina } from '../domain/vacinas';
import { CreateVacinaDto } from '../presenters/http/dto/create-vacina.dto';
import { UpdateVacinaDto } from '../presenters/http/dto/update-vacina.dto';
import { VacinaRepository } from './ports/vacinas.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { CreateGastoDto } from '../../gastos/presenters/http/dto/create-gasto.dto';
import { GastoType } from '../../gastos/domain/enum/gasto.enum';

@Injectable()
export class VacinasService {
  constructor (
    private readonly vacinaRepository: VacinaRepository,
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
  ) {}

  async findAll(): Promise<Vacina[]> {
    return this.vacinaRepository.findAll();
  }

  async findOne(id: number): Promise<Vacina> {
    const vacina = await this.vacinaRepository.findById(id);
    if (!vacina) {
      throw new NotFoundException(`Vacina with ID ${id} not found`);
    }
    return vacina;
  }

  async create(createVacinaDto: CreateVacinaDto): Promise<Vacina> {

    const gastoData: CreateGastoDto = {
      data_gasto: createVacinaDto.data_gasto,
      tipo: createVacinaDto.tipo,
      quantidade: createVacinaDto.quantidade,
      valor: createVacinaDto.valor
    };
    
    const gasto = this.gastoFactory.createGasto(GastoType.Vacina, gastoData, {});
    
    const newVacina = new Vacina(
      gasto.id,
      createVacinaDto.animal_id,
      createVacinaDto.data_vacinacao,
      createVacinaDto.tipo_vacina,
      createVacinaDto.veterinario_id,
      gasto.id,
      gasto.data_gasto,
      gasto.tipo,
      gasto.quantidade,
      gasto.valor
    );

    return this.vacinaRepository.save(newVacina);
  }

  async update(id: number, updateVacinaDto: UpdateVacinaDto): Promise<Vacina> {
    const vacina = await this.findOne(id);

    const updatedVacinaData = {
      ...vacina,
      ...updateVacinaDto,
    };

    const gasto = await this.gastoRepository.findById(updatedVacinaData.gasto_id);
    if (!gasto){
      throw new NotFoundException(`Gasto with ID ${updatedVacinaData.gasto_id} not found`)
    }

    const updatedGastoData = {
      ...gasto,
      data_gasto: updateVacinaDto.data_gasto ?? gasto.data_gasto,
      tipo: updateVacinaDto.tipo ?? gasto.tipo,
      quantidade: updateVacinaDto.quantidade ?? gasto.quantidade,
      valor: updateVacinaDto.valor ?? gasto.valor
    };

    await this.gastoRepository.update(gasto.id, updatedGastoData);

    const result = await this.vacinaRepository.update(id, updatedVacinaData);
    if(!result){
      throw new NotFoundException(`Castração with ID ${id} not found for update.`)
    }

    return updatedVacinaData;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const vacina = await this.findOne(id);
    await this.gastoRepository.remove(vacina.id); 
    await this.vacinaRepository.remove(id); 
    return { deleted: true };
  }
}