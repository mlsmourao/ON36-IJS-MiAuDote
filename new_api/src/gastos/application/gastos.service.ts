import { GastoFactory } from './../domain/factories/gastos-factory';
import { Injectable } from "@nestjs/common";
import { GastoRepository } from "./ports/gasto.repository";
import { Gasto } from '../domain/gastos';
import { CreateGastoDto } from '../presenters/http/dto/create-gasto.dto';


@Injectable()
export class GastosService {
  constructor(
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
  ) {}

  async findAll(): Promise<Gasto[]> {
    return this.gastoRepository.findAll();
  }

  async findOne(id: number): Promise<Gasto> {
    const gasto = await this.gastoRepository.findById(id);
    if (!gasto) {
      throw new Error(`Gasto with ID ${id} not found`);
    }
    return gasto;
  }

  async create(createGastoDto: CreateGastoDto): Promise<Gasto> {
    const newGasto = this.gastoFactory.create(createGastoDto);
    return this.gastoRepository.save(newGasto);
  }

  async update(id: number, updateGastoDto: any): Promise<Gasto> {
    const gasto = await this.findOne(id);

    const updatedGastoData = {
      data_gasto: updateGastoDto.data_gasto ?? gasto.data_gasto,
      tipo: updateGastoDto.tipo ?? gasto.tipo,
      quantidade: updateGastoDto.quantidade ?? gasto.quantidade,
      valor: updateGastoDto.valor ?? gasto.valor,
    };

    const updatedGasto = this.gastoFactory.create(updatedGastoData);

    await this.gastoRepository.update(id, updatedGasto);
    return updatedGasto;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.gastoRepository.remove(id);
    return { deleted: true };
  }
}
