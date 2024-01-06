import moment from 'moment';

export function yearMonthDay(date: Date | string) {
  return moment(date).format('yyyy-MM-DD');
}


