import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PessoaRepository } from "./ports/pessoas.repository";
import { Pessoa } from '../domain/pessoas';

@Injectable()
export class PessoasService {
  constructor(
    private readonly pessoaRepository: PessoaRepository,
  ) {}

  async findAll(): Promise<Pessoa[]> {
    try {
      return await this.pessoaRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve records');
    }
  }

  async findOne(id: number): Promise<Pessoa> {
    const pessoa = await this.pessoaRepository.findById(id);
    if (!pessoa) {
      throw new NotFoundException(`Pessoa with ID ${id} not found`);
    }
    return pessoa;
  }


  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.findOne(id);

    try {
      await this.pessoaRepository.remove(id);
      return { deleted: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete pessoa');
    }
  }
}
