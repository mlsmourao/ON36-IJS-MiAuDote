import { Injectable } from '@nestjs/common';
import { Doacao } from 'src/doacoes/domain/doacoes';
import { Doador } from 'src/doadores/domain/doadores';

@Injectable()
export abstract class DoadorRepository {
  abstract save(doador: Doador): Promise<Doador>;
  abstract findAll(): Promise<Doador[]>;
  abstract findById(id: number): Promise<Doador | null>;
  abstract update(id: number, doador: Partial<Doador>): Promise<Doador | null>;
  abstract remove(id: number): Promise<void>;
  abstract donate(doadorId: number, doacao: Doacao): Promise<Doador | null>;

}
