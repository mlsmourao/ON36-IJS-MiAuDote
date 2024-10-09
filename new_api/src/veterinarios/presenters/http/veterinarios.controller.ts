import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { VeterinariosService } from '../../application/veterinarios.service'; 
import { CreateVeterinarioDto } from './dto/create-veterinario.dto';
import { UpdateVeterinarioDto } from './dto/update-veterinario.dto'; 

@Controller('veterinarios')
export class VeterinariosController {
  constructor(private readonly veterinariosService: VeterinariosService) {}

  @Get()
  async findAll() {
    return this.veterinariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.veterinariosService.findOne(id);
  }

  @Post()
  async create(@Body() createVeterinarioDto: CreateVeterinarioDto) {
    return this.veterinariosService.create(createVeterinarioDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateVeterinarioDto: UpdateVeterinarioDto,
  ) {
    return this.veterinariosService.update(id, updateVeterinarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.veterinariosService.remove(id);
  }
}
