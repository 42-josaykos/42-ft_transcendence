import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
}
