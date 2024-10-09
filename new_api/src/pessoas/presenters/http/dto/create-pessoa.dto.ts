import {
  IsString,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreatePessoaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  cep: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  endereco: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  telefone: string[];

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  cpf: string;
}
