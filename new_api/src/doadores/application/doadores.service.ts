import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Doador } from '../domain/doadores';
import { CreateDoadorDto } from '../presenters/http/dto/create-doador.dto';
import { UpdateDoadorDto } from '../presenters/http/dto/update-doador.dto';
import { DoadorRepository } from './ports/doador.repository';
import { PessoaRepository } from '../../pessoas/application/ports/pessoas.repository';
import { PessoaFactory } from '../../pessoas/domain/factories/pessoas-factory';
import { PessoaType } from '../../pessoas/domain/enum/pessoa.enum';

@Injectable()
export class DoadoresService {
  constructor(
    private readonly doadorRepository: DoadorRepository,
    private readonly pessoaFactory: PessoaFactory,
    private readonly pessoaRepository: PessoaRepository,
  ) {}

  async findAll(): Promise<Doador[]> {
    return this.doadorRepository.findAll();
  }

  async findOne(id: number): Promise<Doador> {
    const doador = await this.doadorRepository.findById(id);
    if (!doador) {
      throw new NotFoundException(`Doador with ID ${id} not found`);
    }
    return doador;
  }

  async create(createDoadorDto: CreateDoadorDto): Promise<Doador> {
    const existingPessoa = await this.pessoaRepository.findByCpf(createDoadorDto.cpf);
    if (existingPessoa) {
      throw new BadRequestException('Já existe um CPF cadastrado.');
    }

    const pessoaData = {
      nome: createDoadorDto.nome,
      cep: createDoadorDto.cep,
      endereco: createDoadorDto.endereco,
      telefone: createDoadorDto.telefone,
      email: createDoadorDto.email,
      cpf: createDoadorDto.cpf,
    };
    
    const pessoa = this.pessoaFactory.createPerson(PessoaType.Doador, pessoaData, {});

    const newDoador = new Doador(
      pessoa.id,
      createDoadorDto.tipo_doacao,
      createDoadorDto.descricao,
      [],
      pessoa.id,
      pessoa.nome,
      pessoa.cep,
      pessoa.endereco,
      pessoa.telefone,
      pessoa.email,
      pessoa.cpf,
    );

    return this.doadorRepository.save(newDoador);
  } 

  async update(
    id: number, 
    updateDoadorDto: UpdateDoadorDto
  ): Promise<Doador> {
    const doador = await this.findOne(id);
    
    const updatedDoadorData = {
      ...doador,
      ...updateDoadorDto,
    };

    const pessoa = await this.pessoaRepository.findById(doador.id);
    if (!pessoa) {
      throw new NotFoundException(`Pessoa with ID ${doador.id} not found`);
    }

    const updatedPessoaData = {
      ...pessoa,
      nome: updateDoadorDto.nome ?? pessoa.nome,
      cep: updateDoadorDto.cep ?? pessoa.cep,
      endereco: updateDoadorDto.endereco ?? pessoa.endereco,
      telefone: updateDoadorDto.telefone ?? pessoa.telefone,
      email: updateDoadorDto.email ?? pessoa.email,
      cpf: updateDoadorDto.cpf ?? pessoa.cpf,
    };

    await this.pessoaRepository.update(doador.id, updatedPessoaData);

    const result = await this.doadorRepository.update(id, updatedDoadorData);
    if (!result) {
      throw new NotFoundException(`Doador with ID ${id} not found for update.`);
    }

    return updatedDoadorData; 
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const doador = await this.findOne(id);
    await this.pessoaRepository.remove(doador.id); 
    await this.doadorRepository.remove(id); 
    return { deleted: true };
  }
}
