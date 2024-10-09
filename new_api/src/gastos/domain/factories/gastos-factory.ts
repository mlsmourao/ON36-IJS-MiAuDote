import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Gasto } from '../gastos';
import { CreateGastoDto } from '../../../gastos/presenters/http/dto/create-gasto.dto';
import { Consumivel } from "../../../consumiveis/domain/consumivel"; 
import { CreateConsumivelDto } from "../../../consumiveis/presenters/http/dto/create-consumivel.dto";
import { Doacao } from "../../../doacoes/domain/doacoes"; 
import { CreateDoacaoDto } from "../../../doacoes/presenters/http/dto/create-doacao.dto";
import { Castracao } from "../../../castracoes/domain/castracao"; 
import { CreateCastracaoDto } from "../../../castracoes/presenters/http/dto/create-castracao.dto";
import { Vacina } from "../../../vacinas/domain/vacinas"; 
import { CreateVacinaDto } from "../../../vacinas/presenters/http/dto/create-vacina.dto";
import { Medicamento } from "../../../medicamentos/domain/medicamentos"; 
import { CreateMedicamentoDto } from "../../../medicamentos/presenters/http/dto/create-medicamento.dto";
import { GastoType } from "../enum/gasto.enum";

@Injectable()
export class GastoFactory {
  createGasto(
    type: GastoType,
    gastoData: CreateGastoDto,
    additionalData: any
  ): Gasto {
    const castracaoId = uuidv4();

    const gasto = new Gasto(
      castracaoId,
      gastoData.data_gasto,
      gastoData.tipo,
      gastoData.quantidade,
      gastoData.valor
    );

    switch (type) {
      case GastoType.Consumivel:
        return this.createConsumivel(gasto, additionalData);
      case GastoType.Doacao:
        return this.createDoacao(gasto, additionalData);
      case GastoType.Castracao:
        return this.createCastracao(gasto, additionalData);
      case GastoType.Vacina:
        return this.createVacina(gasto, additionalData);
      case GastoType.Medicamento:
        return this.createMedicamento(gasto, additionalData);
      default:
        throw new Error('Invalid gasto type');
    }
  }

    private createConsumivel(gasto: Gasto, data: CreateConsumivelDto): Consumivel {
      const id = uuidv4();
      return new Consumivel(
        id,
        data.tipo_animal,
        data.descricao,
        gasto.id,
        gasto.data_gasto,
        gasto.tipo,
        gasto.quantidade,
        gasto.valor
      )
    }

    private createDoacao(gasto: Gasto, data: CreateDoacaoDto): Doacao {
      const id = uuidv4();
      return new Doacao(
        id,
        data.doador_id,
        data.data_doacao,
        data.tipo_doacao,
        data.valor_estimado,
        gasto.id,
        gasto.data_gasto,
        gasto.tipo,
        gasto.quantidade,
        gasto.valor
      )
    }

    private createCastracao(gasto: Gasto, data: CreateCastracaoDto): Castracao {
      const id = uuidv4();
      return new Castracao(
        id,
        data.animal_id,
        data.data_castracao,
        data.condicao_pos,
        data.veterinario_id,
        gasto.id,
        gasto.data_gasto,
        gasto.tipo,
        gasto.quantidade,
        gasto.valor
      )
    }

    private createVacina(gasto: Gasto, data: CreateVacinaDto): Vacina {
      const id = uuidv4();
      return new Vacina(
        id,
        data.animal_id,
        data.data_vacinacao,
        data.tipo_vacina,
        data.veterinario_id,
        gasto.id,
        gasto.data_gasto,
        gasto.tipo,
        gasto.quantidade,
        gasto.valor
      )
    }

    private createMedicamento(gasto: Gasto, data: CreateMedicamentoDto): Medicamento {
      const id = uuidv4();
      return new Medicamento(
        id,
        data.animal_id,
        data.data_compra,
        data.descricao,
        data.veterinario_id,
        gasto.id,
        gasto.data_gasto,
        gasto.tipo,
        gasto.quantidade,
        gasto.valor
      )
    }
  }
