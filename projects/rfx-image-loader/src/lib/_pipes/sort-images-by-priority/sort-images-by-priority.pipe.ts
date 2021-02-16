import { Pipe, PipeTransform } from '@angular/core';
import { RfxImageDataInterface, RfxImageInterface } from '../../_interfaces';

@Pipe({
  name: 'sortImagesByPriority'
})
export class SortImagesByPriorityPipe implements PipeTransform {
  transform(value: RfxImageInterface[] | RfxImageDataInterface[]): RfxImageInterface[] | RfxImageDataInterface[] {
    return [...value].sort((value1, value2) => (value1.priority > value2.priority) ? 1 : -1);
  }
}
