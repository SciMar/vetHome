import { Test, TestingModule } from '@nestjs/testing';
import { ClinicasService } from './clinicas.service';

describe('ClinicasService', () => {
  let service: ClinicasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicasService],
    }).compile();

    service = module.get<ClinicasService>(ClinicasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
