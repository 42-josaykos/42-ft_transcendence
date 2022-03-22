import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  async addElementToArray(toAdd: any[], array: any[]) {
    toAdd.forEach((elem) => {
      array.push(elem);
    });
    return array;
  }

  async removeElementFromArray(toRemove: any[], array: any[]) {
    array = array.filter(
      (elem) => !toRemove.find((remove) => remove.id === elem.id),
    );
    return array;
  }
}
