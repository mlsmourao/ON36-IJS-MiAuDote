import { PessoaRepository } from '../application/ports/pessoas.repository';
import { Pessoa } from '../domain/pessoas';
import { Test, TestingModule } from '@nestjs/testing';
import { PessoasService } from './pessoas.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('Testando PessoasService', () => {
  let service: PessoasService;
  let pessoaRepository: PessoaRepository;

  const pessoa = new Pessoa(
    1,
    'João Silva',
    'Rua das Flores, 123',
    '12345-678',
    ['11987654321'],
    'joao@example.com',
    '123.456.789-00',
  );

  beforeEach(async () => {
    pessoaRepository = {
      findAll: jest.fn().mockResolvedValue([pessoa]),
      findById: jest.fn().mockResolvedValue(pessoa),
      remove: jest.fn().mockResolvedValue(undefined),
    } as unknown as PessoaRepository;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: PessoaRepository,
          useValue: pessoaRepository,
        },
      ],
    }).compile();

    service = module.get<PessoasService>(PessoasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all people', async () => {
    const pessoas = await service.findAll();
    expect(pessoas).toHaveLength(1);
    expect(pessoas[0]).toBeInstanceOf(Pessoa);
    expect(pessoas[0].nome).toBe(pessoa.nome);
  });

  it('should return a person by ID', async () => {
    const foundPessoa = await service.findOne(1);
    expect(foundPessoa).toBeInstanceOf(Pessoa);
    expect(foundPessoa.id).toBe(1);
    expect(foundPessoa.nome).toBe(pessoa.nome);
  });

  it('should throw NotFoundException when person not found', async () => {
    jest.spyOn(pessoaRepository, 'findById').mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should delete a person', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ deleted: true });
    expect(pessoaRepository.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when deleting a non-existent person', async () => {
    jest.spyOn(pessoaRepository, 'findById').mockResolvedValue(null);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException when finding all people fails', async () => {
    jest.spyOn(pessoaRepository, 'findAll').mockRejectedValue(new Error('Database error'));
    await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when removing a person fails', async () => {
    jest.spyOn(pessoaRepository, 'remove').mockRejectedValue(new Error('Database error'));
    await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
  });
});
