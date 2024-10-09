import { Pessoa } from '../../pessoas/domain/pessoas';
import { Doacao } from '../../doacoes/domain/doacoes';

export class Doador extends Pessoa {
  constructor(
    public readonly id: number,
    public readonly tipo_doacao: string,
    public readonly descricao: string,
    public readonly doacao: Doacao[],
    pessoaId?: number,
    nome?: string,
    cep?: string,
    endereco?: string,
    telefone?: string[],
    email?: string,
    cpf?: string,
  ) {
    super(pessoaId, nome, cep, endereco, telefone, email, cpf);
  }
}
