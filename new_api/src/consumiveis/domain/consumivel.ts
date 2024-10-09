import { Gasto } from '../../gastos/domain/gastos';

export class Consumivel extends Gasto{
    constructor(
      public readonly id: number,
      public readonly tipo_animal: string,
      public readonly descricao: string,
      gasto_id?: number,
      data_gasto?: Date,
      tipo?: string,
      quantidade?: number,
      valor?: number
    ) {
      super(gasto_id, data_gasto, tipo, quantidade, valor)
    }
  }
  