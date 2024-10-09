import { Gasto } from '../../gastos/domain/gastos';

export class Doacao extends Gasto{
    constructor(
      public readonly id: number,
      public readonly doador_id: number,
      public readonly data_doacao: Date,
      public readonly tipo_doacao: string,
      public readonly valor_estimado: number,
      gasto_id?: number,
      data_gasto?: Date,
      tipo?: string,
      quantidade?: number,
      valor?: number
    ) {
      super(gasto_id, data_gasto, tipo, quantidade, valor)
    }
  }
  