import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { Pessoa } from "../pessoas";
import { CreatePessoaDto } from "../../presenters/http/dto/create-pessoa.dto";
import { Veterinario } from "../../../veterinarios/domain/veterinarios"; 
import { CreateVeterinarioDto } from "../../../veterinarios/presenters/http/dto/create-veterinario.dto";
import { Doador } from "../../../doadores/domain/doadores"; 
import { CreateDoadorDto } from "../../../doadores/presenters/http/dto/create-doador.dto";
import { Adotante } from "../../../adotantes/domain/adotante";
import { CreateAdotanteDto } from "../../../adotantes/presenters/http/dto/create-adotante.dto";
import { PessoaType } from "../enum/pessoa.enum";
import { Vacina } from "../../../vacinas/domain/vacinas";
import { Medicamento } from "../../../medicamentos/domain/medicamentos";
import { Castracao } from "../../../castracoes/domain/castracao";
import { Doacao } from "../../../doacoes/domain/doacoes";
import { Adocao } from "../../../adocoes/domain/adocao";
import { validarCPF } from "../../../pessoas/infrastructure/helpers/cpf-validator";

@Injectable()
export class PessoaFactory {
    createPerson(
        type: PessoaType,
        pessoaData: CreatePessoaDto,
        additionalData: any
    ): Pessoa {
        if (!validarCPF(pessoaData.cpf)) {
            throw new Error("CPF inválido.");
        }
        const pessoaId = uuidv4();

        const pessoa = new Pessoa(
            pessoaId,
            pessoaData.nome,
            pessoaData.cep,
            pessoaData.endereco,
            pessoaData.telefone,
            pessoaData.email,
            pessoaData.cpf,
        );

        switch (type) {
            case PessoaType.Veterinario:
                return this.createVeterinario(pessoa, additionalData);
            case PessoaType.Doador:
                return this.createDoador(pessoa, additionalData);
            case PessoaType.Adotante:
                return this.createAdotante(pessoa, additionalData);
            default:
                throw new Error('Invalid person type');
        }
    }

    private createVeterinario(pessoa: Pessoa, data: CreateVeterinarioDto): Veterinario {
        const id = uuidv4();
        const vacinas: Vacina[] = [];
        const medicamentos: Medicamento[] = [];
        const castracao: Castracao[] = [];
        return new Veterinario(
            id,
            data.especialidade,
            data.registro_crmv,
            vacinas,
            medicamentos,
            castracao,
            pessoa.id,
            pessoa.nome,
            pessoa.cep,
            pessoa.endereco,
            pessoa.telefone,
            pessoa.email,
            pessoa.cpf
        );
    }
    

    private createDoador(pessoa: Pessoa, data: CreateDoadorDto): Doador {
        const id = uuidv4();
        const doacao: Doacao[] = [];
        return new Doador(
            id,
            data.tipo_doacao,
            data.descricao,
            doacao,
            pessoa.id,
            pessoa.nome,
            pessoa.cep,
            pessoa.endereco,
            pessoa.telefone,
            pessoa.email,
            pessoa.cpf
        );
    }

    private createAdotante(pessoa: Pessoa, data: CreateAdotanteDto): Adotante {
        const adotanteId = uuidv4();
        const adocoes: Adocao[] = [];
        return new Adotante(
            adotanteId,
            data.renda,
            data.condicao_entrevista,
            adocoes,
            pessoa.id,
            pessoa.nome,
            pessoa.cep,
            pessoa.endereco,
            pessoa.telefone,
            pessoa.email,
            pessoa.cpf
        );
    }
}
