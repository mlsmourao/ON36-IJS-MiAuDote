import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VeterinarioRepository } from './ports/veterinarios.repository';
import { Veterinario } from '../domain/veterinarios';
import { PessoaRepository } from '../../pessoas/application/ports/pessoas.repository';
import { UpdateVeterinarioDto } from '../presenters/http/dto/update-veterinario.dto';
import { CreateVeterinarioDto } from '../presenters/http/dto/create-veterinario.dto';
import { PessoaFactory } from '../../pessoas/domain/factories/pessoas-factory';
import { PessoaType } from '../../pessoas/domain/enum/pessoa.enum';
import { CreatePessoaDto } from '../../pessoas/presenters/http/dto/create-pessoa.dto';

@Injectable()
export class VeterinariosService {
  constructor(
    private readonly veterinariosRepository: VeterinarioRepository,
    private readonly pessoaFactory: PessoaFactory,
    private readonly pessoaRepository: PessoaRepository,
  ) {}

  async findAll(): Promise<Veterinario[]> {
    return this.veterinariosRepository.findAll();
  }

  async findOne(id: number): Promise<Veterinario> {
    const veterinario = await this.veterinariosRepository.findById(id);
    if (!veterinario) {
      throw new NotFoundException(`Veterinario with ID ${id} not found`);
    }
    return veterinario;
  }

  async create(
    createVeterinarioDto: CreateVeterinarioDto,
  ): Promise<Veterinario> {
    const existingPessoa = await this.pessoaRepository.findByCpf(
      createVeterinarioDto.cpf,
    );
    if (existingPessoa) {
      throw new BadRequestException('Já existe um CPF cadastrado.');
    }

    const createPessoaDto: CreatePessoaDto = {
      nome: createVeterinarioDto.nome,
      cep: createVeterinarioDto.cep,
      endereco: createVeterinarioDto.endereco,
      telefone: createVeterinarioDto.telefone,
      email: createVeterinarioDto.email,
      cpf: createVeterinarioDto.cpf,
    };

    const pessoa = this.pessoaFactory.createPerson(
      PessoaType.Veterinario,
      createPessoaDto,
      {},
    );

    const newVeterinario = new Veterinario(
      pessoa.id,
      createVeterinarioDto.especialidade,
      createVeterinarioDto.registro_crmv,
      [],
      [],
      [],
      pessoa.id,
      pessoa.nome,
      pessoa.cep,
      pessoa.endereco,
      pessoa.telefone,
      pessoa.email,
      pessoa.cpf,
    );

    const savedVeterinario =
      await this.veterinariosRepository.save(newVeterinario);
    return savedVeterinario;
  }

  async update(
    id: number,
    updateVeterinarioDto: UpdateVeterinarioDto,
  ): Promise<Veterinario> {
    const veterinario = await this.findOne(id);

    const updatedVeterinarioData = {
      ...veterinario,
      ...updateVeterinarioDto,
    };

    const pessoa = await this.pessoaRepository.findById(veterinario.id);
    if (!pessoa) {
      throw new NotFoundException(`Pessoa with ID ${veterinario.id} not found`);
    }

    const updatedPessoaData = {
      ...pessoa,
      nome: updateVeterinarioDto.nome ?? pessoa.nome,
      cep: updateVeterinarioDto.cep ?? pessoa.cep,
      endereco: updateVeterinarioDto.endereco ?? pessoa.endereco,
      telefone: updateVeterinarioDto.telefone ?? pessoa.telefone,
      email: updateVeterinarioDto.email ?? pessoa.email,
      cpf: updateVeterinarioDto.cpf ?? pessoa.cpf,
    };

    await this.pessoaRepository.update(veterinario.id, updatedPessoaData);

    const result = await this.veterinariosRepository.update(id, updatedVeterinarioData);
    if (!result) {
      throw new NotFoundException(`Veterinario with ID ${id} not found for update.`);
    }
    return updatedVeterinarioData;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const veterinario = await this.findOne(id);
    await this.pessoaRepository.remove(veterinario.id); 
    await this.veterinariosRepository.remove(id); 
    return { deleted: true };
  }
}
