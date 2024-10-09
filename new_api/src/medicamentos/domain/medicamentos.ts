import { Gasto } from '../../gastos/domain/gastos';

export class Medicamento extends Gasto {
    constructor(
      public readonly id: number,
      public readonly animal_id: number,
      public readonly data_compra: Date,
      public readonly descricao: string,
      public readonly veterinario_id: number,
      gasto_id?: number,
      data_gasto?: Date,
      tipo?: string,
      quantidade?: number,
      valor?: number
    ) {
      super(gasto_id, data_gasto, tipo, quantidade, valor)
    }
  }
  