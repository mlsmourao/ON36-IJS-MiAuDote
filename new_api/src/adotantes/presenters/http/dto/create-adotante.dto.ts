import { IsNumber, IsString, Min, Length } from 'class-validator';
import { CreatePessoaDto } from '../../../../pessoas/presenters/http/dto/create-pessoa.dto';

export class CreateAdotanteDto extends CreatePessoaDto{
    @IsNumber()
    @Min(0) 
    renda: number;

    @IsString()
    @Length(1, 255) 
    condicao_entrevista: string;
}
