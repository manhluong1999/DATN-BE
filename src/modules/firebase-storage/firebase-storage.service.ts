import { Injectable } from '@nestjs/common';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import * as fs from 'fs';

@Injectable()
export class FirebaseStorageService {
  storage = getStorage();
  constructor() {}

  async uploadImg(filePath: string, buffer: Buffer) {
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, buffer);
  }

  async getdownloadFile(filePath: string) {
    try {
      const storageRef = ref(this.storage, filePath);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.log(error);
    }
  }
}
