import { Test, TestingModule } from '@nestjs/testing';
import { PessoasController } from './pessoas.controller';
import { PessoasService } from '../../../pessoas/application/pessoas.service';

describe('PessoasController', () => {
  let controller: PessoasController;
  let service: PessoasService;

  const mockPessoasService = {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        nome: 'João Silva',
        cep: '12345-678',
        endereco: 'Rua das Flores, 123',
        telefone: ['11987654321'],
        email: 'joao.silva@example.com',
        cpf: '123.456.789-00',
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      nome: 'João Silva',
      cep: '12345-678',
      endereco: 'Rua das Flores, 123',
      telefone: ['11987654321'],
      email: 'joao.silva@example.com',
      cpf: '123.456.789-00',
    }),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PessoasController],
      providers: [
        {
          provide: PessoasService,
          useValue: mockPessoasService,
        },
      ],
    }).compile();

    controller = module.get<PessoasController>(PessoasController);
    service = module.get<PessoasService>(PessoasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all pessoas', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        id: 1,
        nome: 'João Silva',
        cep: '12345-678',
        endereco: 'Rua das Flores, 123',
        telefone: ['11987654321'],
        email: 'joao.silva@example.com',
        cpf: '123.456.789-00',
      },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one pessoa by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({
      id: 1,
      nome: 'João Silva',
      cep: '12345-678',
      endereco: 'Rua das Flores, 123',
      telefone: ['11987654321'],
      email: 'joao.silva@example.com',
      cpf: '123.456.789-00',
    });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

});
