import {Pipe, PipeTransform} from '@angular/core';

export function getDecodeDayTimeFromNumberPipe(timeNumber: number, mode = 24) {
  const timeBits = (timeNumber / 60).toString().split('.');
  let hr = parseInt(timeBits[0], 0);
  let minutes = timeBits[1];
  minutes = (parseFloat('0.' + minutes) * 60).toFixed(0);
  let extension = 'AM';
  if (hr >= 12) {
    extension = 'PM';
  }
  if (mode === 12 && hr > 12) {
    hr = hr - 12;
  }
  let hrFormat = '';
  let minutesFormat = '';
  if (hr < 10) {
    hrFormat = '0';
  }
  if (parseInt(minutes, 0) < 10) {
    minutesFormat = '0';
  }
  return hrFormat + hr + ':' + minutesFormat + minutes + ((mode === 12) ? ' ' + extension : '');
}

@Pipe({
  name: 'decodeDayTime'
})
export class DecodeDayTimeFromNumberPipe implements PipeTransform {

  transform(timeNumber: number, mode = 24): any {
    return getDecodeDayTimeFromNumberPipe(timeNumber, mode);
  }
}
