import {
  Controller,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PessoasService } from '../../../pessoas/application/pessoas.service'; 

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Get()
  async findAll() {
    return this.pessoasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.pessoasService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.pessoasService.remove(id);
  }
}
