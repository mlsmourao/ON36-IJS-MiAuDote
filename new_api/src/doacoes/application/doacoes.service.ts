import { Injectable, NotFoundException } from '@nestjs/common';
import { Doacao } from '../domain/doacoes';
import { CreateDoacaoDto } from '../presenters/http/dto/create-doacao.dto';
import { UpdateDoacaoDto } from '../presenters/http/dto/update-doacao.dto';
import { DoacaoRepository } from './ports/doacao.repository';
import { GastoRepository } from '../../gastos/application/ports/gasto.repository';
import { GastoFactory } from '../../gastos/domain/factories/gastos-factory';
import { CreateGastoDto } from '../../gastos/presenters/http/dto/create-gasto.dto';
import { GastoType } from '../../gastos/domain/enum/gasto.enum';

@Injectable()
export class DoacoesService {
  constructor(
    private readonly doacaoRepository: DoacaoRepository,
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
  ) {}

  async findAll(): Promise<Doacao[]> {
    return this.doacaoRepository.findAll();
  }

  async findOne(id: number): Promise<Doacao> {
    const doacao = await this.doacaoRepository.findById(id);
    if (!doacao) {
      throw new NotFoundException(`Doacao with ID ${id} not found`);
    }
    return doacao;
  }

  private ensureNegativeValue(value: number): number {
    return value > 0 ? -value : value;
  }

  async create(createDoacaoDto: CreateDoacaoDto): Promise<Doacao> {

    createDoacaoDto.valor_estimado = this.ensureNegativeValue(createDoacaoDto.valor_estimado);

    const gastoData: CreateGastoDto = {
      data_gasto: createDoacaoDto.data_gasto,
      tipo: createDoacaoDto.tipo,
      quantidade: createDoacaoDto.quantidade,
      valor: this.ensureNegativeValue(createDoacaoDto.valor)
    };

    const gasto = this.gastoFactory.createGasto(GastoType.Castracao, gastoData, {});

    const newDoacao = new Doacao(
      gasto.id,
      createDoacaoDto.doador_id,
      createDoacaoDto.data_gasto,
      createDoacaoDto.tipo_doacao,
      createDoacaoDto.valor_estimado,
      gasto.id,
      gasto.data_gasto,
      gasto.tipo,
      gasto.quantidade,
      gasto.valor
    )

    return this.doacaoRepository.save(newDoacao);
}

async update(id: number, updateDoacaoDto: UpdateDoacaoDto): Promise<Doacao> {
  const doacao = await this.findOne(id);

  updateDoacaoDto.valor_estimado = this.ensureNegativeValue(updateDoacaoDto.valor_estimado);

  const updatedDoacaoData = {
    ...doacao,
    ...updateDoacaoDto,
  }

  const gasto = await this.gastoRepository.findById(updatedDoacaoData.gasto_id);
  if(!gasto){
    throw new NotFoundException(`Gasto with ID ${updatedDoacaoData.gasto_id} not found`)
  }

  const updatedGastoData = {
    ...gasto,
    data_gasto: updateDoacaoDto.data_gasto ?? gasto.data_gasto,
    tipo: updateDoacaoDto.tipo ?? gasto.tipo,
    quantidade: updateDoacaoDto.quantidade ?? gasto.quantidade,
    valor: this.ensureNegativeValue(updateDoacaoDto.valor ?? gasto.valor),
  }

  await this.doacaoRepository.update(gasto.id, updatedGastoData);

  const result = await this.doacaoRepository.update(id, updatedDoacaoData);

  if(!result){
    throw new NotFoundException(`Doacao with ID ${id} not found for update.`)
  }

  return updatedDoacaoData;}

  async remove(id: number): Promise<{ deleted: boolean }> {
    const doacao = await this.findOne(id);
    await this.gastoRepository.remove(doacao.id);
    await this.doacaoRepository.remove(id);
    return { deleted: true };
  }
}
