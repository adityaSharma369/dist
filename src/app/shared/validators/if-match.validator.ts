import {FormGroup} from '@angular/forms';

export function IfMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        // return null if controls haven't initialised yet
        if (!control || !matchingControl) {
            return null;
        }

        // return null if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors.ifMatch) {
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value === matchingControl.value) {
            matchingControl.setErrors({ifMatch: true});
        } else {
            matchingControl.setErrors(null);
        }
    };
}
