import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bufferToBase64', () => {
    it('should return the respective base64 encoded string', () => {
      const buffer = Buffer.from('Hello world!');
      const base64String = 'SGVsbG8gd29ybGQh';
      const result = service.bufferToBase64(buffer);
      expect(result).toEqual(base64String);
    });
  });

  describe('base64ToBuffer', () => {
    it('should return the respective buffer', () => {
      const buffer = Buffer.from('Hello world!');
      const base64String = 'SGVsbG8gd29ybGQh';
      const result = service.base64ToBuffer(base64String);
      expect(result).toEqual(buffer);
    });
  });
});
