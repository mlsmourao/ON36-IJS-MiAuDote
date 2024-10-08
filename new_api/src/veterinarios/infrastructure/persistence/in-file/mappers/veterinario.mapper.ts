import { Veterinario } from "src/veterinarios/domain/veterinarios";
import { VeterinarioEntity } from "../entities/veterinario.entity";
import { PessoaMapper } from "src/pessoas/infrastructure/persistence/in-file/mappers/pessoa.mapper";
import { VacinaMapper } from "src/vacinas/infrastructure/persistence/in-file/mappers/vacina.mapper";
import { MedicamentoMapper } from "src/medicamentos/infrastructure/persistence/in-file/mappers/medicamento.mapper";
import { CastracaoMapper } from "src/castracoes/infrastructure/persistence/in-file/mappers/castracao.mappers"; 

export class VeterinarioMapper {
    static paraDominio(veterinarioEntity: VeterinarioEntity): Veterinario {
        const {id, especialidade, registro_crmv, pessoa_id, pessoa, vacina, medicamento, castracao} = veterinarioEntity;

        return new Veterinario(
            id,
            especialidade,
            registro_crmv,
            vacina?.map(VacinaMapper.paraDominio) || [],
            medicamento?.map(MedicamentoMapper.paraDominio) || [],
            castracao?.map(CastracaoMapper.paraDominio) || [],
            pessoa_id,
            pessoa.nome,
            pessoa.cep,
            pessoa.endereco,
            pessoa.telefone,
            pessoa.email,
            pessoa.cpf
        );
    }

    static paraPersistencia(veterinario: Veterinario): VeterinarioEntity {
        const entity = new VeterinarioEntity();
        entity.id = veterinario.id;
        entity.especialidade = veterinario.especialidade;
        entity.registro_crmv = veterinario.registro_crmv;
        
        entity.pessoa = PessoaMapper.paraPersistencia(veterinario);
        entity.vacina = veterinario.vacinas?.map(vacina => VacinaMapper.paraPersistencia(vacina)) || [];
        entity.medicamento = veterinario.medicamentos?.map(medicamento => MedicamentoMapper.paraPersistencia(medicamento)) || [];
        entity.castracao = veterinario.castracoes?.map(castracao => CastracaoMapper.paraPersistencia(castracao)) || [];
    
        return entity;
    }
}
