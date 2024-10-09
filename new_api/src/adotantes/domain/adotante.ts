import { Pessoa } from '../../pessoas/domain/pessoas';
import { Adocao } from '../../adocoes/domain/adocao';

export class Adotante extends Pessoa {
  constructor(
    public readonly id: number,
    public readonly renda: number,
    public readonly condicao_entrevista: string,
    public readonly adocao: Adocao[],
    pessoa_id?: number,
    nome?: string,
    cep?: string,
    endereco?: string,
    telefone?: string[],
    email?: string,
    cpf?: string,
  ) {
    super(pessoa_id, nome, cep, endereco, telefone, email, cpf);
  }
}
