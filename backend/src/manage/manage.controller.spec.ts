import { Test, TestingModule } from '@nestjs/testing';
import { ManageController } from './manage.controller';
import { ManageService } from './manage.service';

describe('ManageController', () => {
  let controller: ManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManageController],
      providers: [ManageService],
    }).compile();

    controller = module.get<ManageController>(ManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
