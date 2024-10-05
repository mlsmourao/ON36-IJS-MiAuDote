export class UpdateAdocoesCommand {
    constructor(
      public readonly id: number,
      public readonly adotante_id?: number,
      public readonly animal_id?: number,
      public readonly data_adocao?: Date,
      public readonly condicoes_especiais?: string,
      public readonly status_aprovacao?: string
    ) {}
  }