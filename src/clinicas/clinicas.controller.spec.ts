import { Test, TestingModule } from '@nestjs/testing';
import { ClinicasController } from './clinicas.controller';

describe('ClinicasController', () => {
  let controller: ClinicasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicasController],
    }).compile();

    controller = module.get<ClinicasController>(ClinicasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
