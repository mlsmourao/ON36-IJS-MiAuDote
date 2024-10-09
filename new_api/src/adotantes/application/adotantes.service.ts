import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Adotante } from '../domain/adotante';
import { CreateAdotanteDto } from '../presenters/http/dto/create-adotante.dto';
import { UpdateAdotanteDto } from '../presenters/http/dto/update-adotante.dto';
import { AdotanteRepository } from './ports/adotantes.repository';
import { PessoaRepository } from '../../pessoas/application/ports/pessoas.repository';
import { PessoaFactory } from '../../pessoas/domain/factories/pessoas-factory';
import { CreatePessoaDto } from '../../pessoas/presenters/http/dto/create-pessoa.dto';
import { PessoaType } from '../../pessoas/domain/enum/pessoa.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdotantesService {
  constructor(
    private readonly adotanteRepository: AdotanteRepository,
    private readonly pessoaFactory: PessoaFactory,
    private readonly pessoaRepository: PessoaRepository,
  ) {}

  async findAll(): Promise<Adotante[]> {
    return this.adotanteRepository.findAll();
  }

  async findOne(id: number): Promise<Adotante> {
    const adotante = await this.adotanteRepository.findById(id);
    if (!adotante) {
      throw new NotFoundException(`Adotante with ID ${id} not found`);
    }
    return adotante;
  }

  async create(createAdotanteDto: CreateAdotanteDto): Promise<Adotante> {
    const existingPessoa = await this.pessoaRepository.findByCpf(createAdotanteDto.cpf);
    if (existingPessoa) {
      throw new BadRequestException('Já existe o CPF');
    }

    const pessoaData: CreatePessoaDto = {
      nome: createAdotanteDto.nome,
      cep: createAdotanteDto.cep,
      endereco: createAdotanteDto.endereco,
      telefone: createAdotanteDto.telefone,
      email: createAdotanteDto.email,
      cpf: createAdotanteDto.cpf,
    };

    const pessoa = this.pessoaFactory.createPerson(PessoaType.Adotante, pessoaData, {});
    const adotanteId = uuidv4();
    
    const newAdotante = new Adotante(
      adotanteId,
      createAdotanteDto.renda,
      createAdotanteDto.condicao_entrevista,
      [],
      pessoa.id,
      pessoa.nome,
      pessoa.cep,
      pessoa.endereco,
      pessoa.telefone,
      pessoa.email,
      pessoa.cpf,
    );

    return this.adotanteRepository.save(newAdotante);
  }

  async update(
    id: number, 
    updateAdotanteDto: UpdateAdotanteDto
  ): Promise<Adotante> {
    const adotante = await this.findOne(id);
    
    const updatedAdotanteData = {
      ...adotante,
      ...updateAdotanteDto,
    };

    const pessoa = await this.pessoaRepository.findById(adotante.id);
    if (!pessoa) {
      throw new NotFoundException(`Pessoa with ID ${adotante.id} not found`);
    }

    const updatedPessoaData = {
      ...pessoa,
      nome: updateAdotanteDto.nome ?? pessoa.nome,
      cep: updateAdotanteDto.cep ?? pessoa.cep,
      endereco: updateAdotanteDto.endereco ?? pessoa.endereco,
      telefone: updateAdotanteDto.telefone ?? pessoa.telefone,
      email: updateAdotanteDto.email ?? pessoa.email,
      cpf: updateAdotanteDto.cpf ?? pessoa.cpf,
    };

    await this.pessoaRepository.update(adotante.id, updatedPessoaData);

    const result = await this.adotanteRepository.update(id, updatedAdotanteData);
    if (!result) {
      throw new NotFoundException(`Adotante with ID ${id} not found for update.`);
    }

    return updatedAdotanteData; 
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const adotante = await this.findOne(id);
    await this.pessoaRepository.remove(adotante.id); 
    await this.adotanteRepository.remove(id); 
    return { deleted: true };
  }
}
