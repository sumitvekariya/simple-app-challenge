import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonService } from '../shared/common.service';

export function uniqueUsernameValidator(commonService: CommonService): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    return commonService.checkIsUsernameUnique(c.value);
  };

}
