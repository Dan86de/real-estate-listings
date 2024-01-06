import { MaxFileCountPipe } from './max-file-count.pipe';
import { BadRequestException } from '@nestjs/common';

describe('MaxFileCountPipe', () => {
  let maxFileCountPipe: MaxFileCountPipe;

  beforeEach(() => {
    maxFileCountPipe = new MaxFileCountPipe(2);
  });

  it('should be defined', () => {
    expect(maxFileCountPipe).toBeDefined();
  });

  it(
    'should return bad request if the number of files is greater' +
      ' than the maxCount',
    () => {
      const file = {} as Express.Multer.File;
      const result = () => maxFileCountPipe.transform([file, file, file]);
      expect(result).toThrow(BadRequestException);
    },
  );

  it(
    'should return files passed if the number of files is less' +
      ' than the maxCount',
    () => {
      const file = {} as Express.Multer.File;
      const result = maxFileCountPipe.transform([file]);
      expect(result).toEqual([file]);
    },
  );

  it(
    'should return files passed if the number of files is same' +
      ' as the maxCount',
    () => {
      const file = {} as Express.Multer.File;
      const result = maxFileCountPipe.transform([file, file]);
      expect(result).toEqual([file, file]);
    },
  );
});
