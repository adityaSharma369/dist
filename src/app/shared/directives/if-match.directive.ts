import {Directive, Input} from '@angular/core';
import {FormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {IfMatch} from '../validators/if-match.validator';
@Directive({
    selector: '[ifMatch]',
    providers: [{provide: NG_VALIDATORS, useExisting: IfMatchDirective, multi: true}]
})
export class IfMatchDirective implements Validator {
    @Input() ifMatch: string[] = [];

    validate(formGroup: FormGroup): ValidationErrors {
        return IfMatch(this.ifMatch[0], this.ifMatch[1])(formGroup);
    }
}
