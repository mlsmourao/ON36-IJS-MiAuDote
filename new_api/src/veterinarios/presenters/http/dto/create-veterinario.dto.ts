import { IsString, IsNumber, Length, Min } from 'class-validator';
import { CreatePessoaDto } from '../../../../pessoas/presenters/http/dto/create-pessoa.dto';

export class CreateVeterinarioDto extends CreatePessoaDto{
    @IsString()
    @Length(1, 255)
    especialidade: string;

    @IsString()
    @Length(1, 10)
    registro_crmv: string;
}
