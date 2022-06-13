import { BadRequestExceptionCustom } from '../exceptions';

export class FileParams {
  size: number;
  fieldname: string;
  originalname: string;
  encoding: string;
}
export function validateFileUpload(fileList: FileParams[]): any {
  if (fileList && fileList.length > 0) {
    if (fileList.length > 5) {
      throw new BadRequestExceptionCustom('File length must be smaller than 5');
    }

    for (const file of fileList) {
      if (file.size > 10 * 1000 * 1000) {
        throw new BadRequestExceptionCustom('File size is over accepted limit');
      }
    }
  }
  return true;
}
