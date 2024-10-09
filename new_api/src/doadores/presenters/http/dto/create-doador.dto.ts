import { IsString, IsNumber, Length, Min } from 'class-validator';
import { CreatePessoaDto } from '../../../../pessoas/presenters/http/dto/create-pessoa.dto';

export class CreateDoadorDto extends CreatePessoaDto {
    @IsString()
    @Length(1, 255)
    tipo_doacao: string;

    @IsString()
    @Length(1, 255)
    descricao: string
}
