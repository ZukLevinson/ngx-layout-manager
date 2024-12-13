import { Pipe, PipeTransform } from '@angular/core';
import { Molecule } from '@ngx-layout-manager/models';
import { isEmpty } from 'lodash';

@Pipe({
  name: 'isSingleMolecule'
})
export class IsSingleMoleculePipe implements PipeTransform {
  transform(value: Molecule): boolean {
    return isEmpty(value.molecules);
  }
}
