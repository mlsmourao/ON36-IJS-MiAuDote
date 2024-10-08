import { Adocao } from 'src/adocoes/domain/adocao';
import { AdocaoEntity } from '../entities/adocao.entity';
import { AdotanteMapper } from 'src/adotantes/infrastructure/persistence/in-memory/mappers/adotante.mappers';
import { AnimalMapper } from 'src/animais/infrastructure/persistence/in-memory/mappers/animais.mapper';

export class AdocaoMapper {
  static paraDominio(adocaoEntity: AdocaoEntity): Adocao {
    const model = new Adocao(
      adocaoEntity.id,
      adocaoEntity.adotante_id,
      adocaoEntity.animal_id,
      adocaoEntity.data_adocao,
      adocaoEntity.condicoes_especiais,
      adocaoEntity.status_aprovacao,
      AnimalMapper.paraDominio(adocaoEntity.animal),
      AdotanteMapper.paraDominio(adocaoEntity.adotante)
    );
    return model;
  }

  static paraPersistencia(adocao: Adocao): AdocaoEntity {
    const entity = new AdocaoEntity();
    entity.id = adocao.id;
    entity.adotante_id = adocao.adotante_id;
    entity.animal_id = adocao.animal_id;
    entity.data_adocao = adocao.data_adocao;
    entity.condicoes_especiais = adocao.condicoes_especiais;
    entity.status_aprovacao = adocao.status_aprovacao;
    entity.animal = AnimalMapper.paraPersistencia(adocao.animal);
    entity.adotante = AdotanteMapper.paraPersistencia(adocao.adotante);
    return entity;
  }
}
