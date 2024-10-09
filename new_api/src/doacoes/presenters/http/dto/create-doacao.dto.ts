import { Type } from 'class-transformer';
import { IsNumber, IsDate, IsString, Length, Min, Max } from 'class-validator';
import { CreateGastoDto } from '../../../../gastos/presenters/http/dto/create-gasto.dto';

export class CreateDoacaoDto extends CreateGastoDto {
    @IsNumber()
    @Min(1)  
    doador_id: number;

    @IsDate() 
    @Type(() => Date)
    data_doacao: Date;

    @IsString()
    @Length(1, 255)  
    tipo_doacao: string;

    @IsNumber()
    @Max(0)  
    valor_estimado: number;

    @IsNumber()
    @Min(1)  
    gasto_id: number;
}
