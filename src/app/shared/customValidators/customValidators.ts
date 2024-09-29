import { AbstractControl, ValidatorFn, ValidationErrors,Validators  } from "@angular/forms";

export class CustomValidators  extends Validators {



  static MaxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const length: number = control.value ? control.value.length : 0;
      if(length > maxLength) {
        control.setValue(control.value.slice(0,maxLength));
      }
      return null;
    };
  }

  static Numeric (control: AbstractControl) {
    if(control.value === null || control.value === undefined || control.value === ''){
    }
    else if((/[^0-9]/.test(control.value))) {
      control.setValue(control.value.toString().replace(/[^0-9]*/g, ''));
    }
    return null;
  }



static skillValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const skills = control.value as string[];
    return skills && skills.length > 0 ? null : { noSkills: true };
  };
}

static ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = control.value;
    return age !== null && age <= 18 ? { 'ageTooLow': true } : null;
  };
}

static nameExistsValidator(peopleArray: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value?.trim().toLowerCase(); 
    const nameExists = peopleArray.some(person => 
      person.name.trim().toLowerCase() === name 
    );
    return nameExists ? { nameExists: true } : null;
  };
}

}