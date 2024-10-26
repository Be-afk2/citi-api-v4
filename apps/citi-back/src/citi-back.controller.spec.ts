import { Test, TestingModule } from '@nestjs/testing';
import { CitiBackController } from './citi-back.controller';
import { CitiBackService } from './citi-back.service';

describe('CitiBackController', () => {
  let citiBackController: CitiBackController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CitiBackController],
      providers: [CitiBackService],
    }).compile();

    citiBackController = app.get<CitiBackController>(CitiBackController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(citiBackController.getHello()).toBe('Hello World!');
    });
  });
});
