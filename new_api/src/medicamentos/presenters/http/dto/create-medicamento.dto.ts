import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsString, Length, Min } from 'class-validator';
import { CreateGastoDto } from '../../../../gastos/presenters/http/dto/create-gasto.dto';

export class CreateMedicamentoDto extends CreateGastoDto {
    @IsNumber()
    @Min(1)  
    animal_id: number;

    @IsDate()  
    @Type(() => Date)
    data_compra: Date;

    @IsString()
    @Length(1, 255) 
    descricao: string;

    @IsNumber()
    @Min(1)  
    veterinario_id: number;

    @IsNumber()
    @Min(1)  
    gasto_id: number;
}
