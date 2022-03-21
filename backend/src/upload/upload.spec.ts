import { Test, TestingModule } from '@nestjs/testing';
import { Upload } from './upload';

describe('Upload', () => {
  let provider: Upload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Upload],
    }).compile();

    provider = module.get<Upload>(Upload);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
