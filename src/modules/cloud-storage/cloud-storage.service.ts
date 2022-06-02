import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudStorageService {
  storage = getStorage();
  constructor() {}

  async uploadImg(fileName: string, buffer: Buffer) {
    const storageRef = ref(this.storage, fileName);
    await uploadBytes(storageRef, buffer);
  }

  async getdownloadFile(fileName: string) {
    try {
      const storageRef = ref(this.storage, fileName);
      const url = await getDownloadURL(storageRef);
      return { url };
    } catch (error) {
      console.log(error);
    }
  }
}
