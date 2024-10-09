import { Test, TestingModule } from '@nestjs/testing';
import { DoacoesController } from '../../presenters/http/doacoes.controller';
import { DoacoesService } from '../../application/doacoes.service';
import { CreateDoacaoDto } from './dto/create-doacao.dto';
import { UpdateDoacaoDto } from './dto/update-doacao.dto';

describe('DoacoesController', () => {
  let controller: DoacoesController;
  let service: DoacoesService;

  const mockDoacoesService = {
    create: jest.fn((dto: CreateDoacaoDto) => ({
      id: Date.now(),
      ...dto,
      data_gasto: dto.data_gasto || new Date(),
    })),
    findAll: jest.fn(() => [
      {
        id: 1,
        doador_id: 1,
        data_doacao: new Date(),
        tipo_doacao: 'Dinheiro',
        valor_estimado: 100,
        gasto_id: 1,
        data_gasto: new Date(),
        tipo: 'Consumível',
        quantidade: 1,
        valor: 123,
      },
    ]),
    findOne: jest.fn((id: number) => ({
      id,
      doador_id: 1,
      data_doacao: new Date(),
      tipo_doacao: 'Dinheiro',
      valor_estimado: 100,
      gasto_id: 1,
      data_gasto: new Date(),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    })),
    update: jest.fn((id: number, dto: UpdateDoacaoDto) => ({
      id,
      ...dto,
      data_gasto: dto.data_gasto || new Date(),
    })),
    remove: jest.fn((id: number) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoacoesController],
      providers: [
        {
          provide: DoacoesService,
          useValue: mockDoacoesService,
        },
      ],
    }).compile();

    controller = module.get<DoacoesController>(DoacoesController);
    service = module.get<DoacoesService>(DoacoesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new doacao', async () => {
    const dto: CreateDoacaoDto = {
      doador_id: 1,
      data_doacao: new Date(2019, 1, 1),
      tipo_doacao: 'Dinheiro',
      valor_estimado: 100,
      gasto_id: 1,
      data_gasto: new Date(2019, 1, 1),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    };

    const result = await controller.create(dto);
    expect(result).toEqual({
      id: expect.any(Number),
      ...dto,
      data_gasto: expect.any(Date),
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all doacoes', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: 1,
        doador_id: 1,
        data_doacao: expect.any(Date),
        tipo_doacao: 'Dinheiro',
        valor_estimado: 100,
        gasto_id: 1,
        data_gasto: expect.any(Date),
        tipo: 'Consumível',
        quantidade: 1,
        valor: 123,
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a doacao by id', async () => {
    const id = 1;
    expect(await controller.findOne(id)).toEqual({
      id,
      doador_id: 1,
      data_doacao: expect.any(Date),
      tipo_doacao: 'Dinheiro',
      valor_estimado: 100,
      gasto_id: 1,
      data_gasto: expect.any(Date),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    });
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a doacao', async () => {
    const id = 1;
    const dto: UpdateDoacaoDto = {
      doador_id: 1,
      data_doacao: new Date(2019, 1, 1),
      tipo_doacao: 'Dinheiro',
      valor_estimado: 100,
      gasto_id: 1,
      data_gasto: new Date(2019, 1, 1),
      tipo: 'Consumível',
      quantidade: 1,
      valor: 123,
    };

    expect(await controller.update(id, dto)).toEqual({
      id,
      ...dto,
      data_gasto: expect.any(Date),
    });
    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a doacao', async () => {
    const id = 1;
    const result = await controller.remove(id);
    expect(result).toEqual({ id });
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});

