import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'textKeysNormalize'})
export class TextNormalizePipe implements PipeTransform {

  /**
   * converts keys with underscore to normal text with spaces.
   */
  transform(txt: string): string {
    let text = txt.split('_').join(' ');
    if (text.length <= 3) {
      text = text.toLocaleUpperCase();
    }
    return text;
  }
}




