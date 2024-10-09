import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsString, Length, Min } from 'class-validator';
import { CreateGastoDto } from '../../../../gastos/presenters/http/dto/create-gasto.dto';

export class CreateCastracaoDto extends CreateGastoDto {
    @IsNumber()
    @Min(1)
    animal_id: number;

    @IsDate()
    @Type(() => Date)  
    data_castracao: Date;

    @IsString()
    @Length(1, 255)  
    condicao_pos: string;

    @IsNumber()
    @Min(1)  
    veterinario_id: number;

    @IsNumber()
    @Min(1)  
    gasto_id: number;
}
