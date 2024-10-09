import { Test, TestingModule } from '@nestjs/testing';
import { CastracoesController } from './castracoes.controller';
import { CastracoesService } from '../../application/castracoes.service';
import { CreateCastracaoDto } from './dto/create-castracao.dto';
import { UpdateCastracaoDto } from './dto/update-castracao.dto';

describe('Teste para CastracoesController', () => {
  let controller: CastracoesController;
  let service: CastracoesService;

  const mockCastracoesService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
        data_castracao: dto.data_castracao || new Date(),
      };
    }),
    findAll: jest.fn(() => [
      {
        id: 1,
        animal_id: 1,
        data_castracao: new Date(),
        condicao_pos: 'Nenhuma',
        veterinario_id: 1,
        gasto_id: 1,
      },
    ]),
    findOne: jest.fn((id) => ({
      id,
      animal_id: 1,
      data_castracao: new Date(),
      condicao_pos: 'Nenhuma',
      veterinario_id: 1,
      gasto_id: 1,
    })),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
      data_castracao: dto.data_castracao || new Date(),
    })),
    remove: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastracoesController],
      providers: [
        {
          provide: CastracoesService,
          useValue: mockCastracoesService,
        },
      ],
    }).compile();

    controller = module.get<CastracoesController>(CastracoesController);
    service = module.get<CastracoesService>(CastracoesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new castration', async () => {
    const dto: CreateCastracaoDto = {
      animal_id: 1,
      data_castracao: new Date(),
      condicao_pos: 'Nenhuma',
      veterinario_id: 1,
      gasto_id: 1,
      data_gasto: undefined,
      tipo: '',
      quantidade: 0,
      valor: 0
    };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of castrations', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: 1,
        animal_id: 1,
        data_castracao: new Date(),
        condicao_pos: 'Nenhuma',
        veterinario_id: 1,
        gasto_id: 1,
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single castration by ID', async () => {
    const id = 1;
    expect(await controller.findOne(id)).toEqual({
      id,
      animal_id: 1,
      data_castracao: new Date(),
      condicao_pos: 'Nenhuma',
      veterinario_id: 1,
      gasto_id: 1,
    });

    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update an castration', async () => {
    const id = 1;
    const dto: UpdateCastracaoDto = {
      animal_id: 1,
      data_castracao: new Date(),
      condicao_pos: 'Updated',
      veterinario_id: 1,
      gasto_id: 1,
    };

    expect(await controller.update(id, dto)).toEqual({
      id,
      ...dto,
    });

    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove an castration', async () => {
    const id = 1;
    expect(await controller.remove(id)).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
