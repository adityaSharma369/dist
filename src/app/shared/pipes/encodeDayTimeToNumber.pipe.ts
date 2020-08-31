import {Pipe, PipeTransform} from '@angular/core';

export function getEncodeDayTimeToNumberPipe(time: any) {
  time = time || '';
  if (typeof time !== 'string') {
    time = time.toString();
  }
  if (time.length === 0) {
    return 0;
  }
  const timeStringBits = time.split(' ');
  const timeString = timeStringBits[0] || '';
  let modifier = '';
  if (timeStringBits.length === 2) {
    modifier = timeStringBits[1];
  }
  const timeBits = timeString.split(':');
  let hours = parseInt(timeBits[0], 0);
  let minutes = parseInt(timeBits[1], 0);
  if (hours >= 12) {
    hours = 0;
  }
  if (modifier === 'PM') {
    hours = hours + 12;
  }
  minutes = (hours * 60) + minutes;
  return minutes;
}

@Pipe({
  name: 'encodeDayTime'
})
export class EncodeDayTimeToNumberPipe implements PipeTransform {

  transform(time: string, args?: any): number {
    return getEncodeDayTimeToNumberPipe(time);
  }
}
