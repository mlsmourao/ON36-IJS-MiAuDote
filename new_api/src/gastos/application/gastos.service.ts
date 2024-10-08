import { GastoFactory } from './../domain/factories/gastos-factory';
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { GastoRepository } from "./ports/gasto.repository";
import { Gasto } from '../domain/gastos';

@Injectable()
export class GastosService {
  constructor(
    private readonly gastoFactory: GastoFactory,
    private readonly gastoRepository: GastoRepository,
  ) {}

  async findAll(): Promise<Gasto[]> {
    try {
      return await this.gastoRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve records');
    }
  }

  async findOne(id: number): Promise<Gasto> {
    const gasto = await this.gastoRepository.findById(id);
    if (!gasto) {
      throw new Error(`Gasto with ID ${id} not found`);
    }
    return gasto;
  }


  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.gastoRepository.remove(id);
    return { deleted: true };
  }
}
