import { DynamicModule, forwardRef, Module, Type } from '@nestjs/common';
import { PessoasService } from './pessoas.service'; 
import { PessoasController } from '../presenters/http/pessoas.controller';  
import { PessoaRepository } from './ports/pessoas.repository';
import { InFilePessoaRepository } from '../infrastructure/persistence/in-file/repositories/pessoa.repository';
import { PessoaFactory } from '../domain/factories/pessoas-factory';
import { DoadoresModule } from 'src/doadores/application/doadores.module';
import { AdotantesModule } from 'src/adotantes/application/adotantes.module';
import { VeterinariosModule } from 'src/veterinarios/application/veterinarios.module';

@Module({
  imports: [
    forwardRef(() => DoadoresModule),
    forwardRef(() => AdotantesModule),
    forwardRef(() => VeterinariosModule),
  ],
  controllers: [PessoasController],
  providers: [
    PessoasService, 
    PessoaFactory,
    { provide: PessoaRepository, useClass: InFilePessoaRepository },
  ],
  exports: [PessoasService, PessoaRepository],
})
export class PessoasModule {
  static comInfraestrutura(infrastructureModule: Type | DynamicModule) {
    return {
      module: PessoasModule,
      imports: [infrastructureModule],
    };
  }
}
