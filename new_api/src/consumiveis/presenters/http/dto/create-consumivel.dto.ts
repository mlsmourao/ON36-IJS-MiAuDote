import { IsNumber, IsString, Length, Min } from 'class-validator';
import { CreateGastoDto } from '../../../../gastos/presenters/http/dto/create-gasto.dto';

export class CreateConsumivelDto extends CreateGastoDto{
    @IsString()
    @Length(1, 255)  
    tipo_animal: string;

    @IsString()
    @Length(1, 255)  
    descricao: string;

    @IsNumber()
    @Min(1)  
    gasto_id: number;
}
