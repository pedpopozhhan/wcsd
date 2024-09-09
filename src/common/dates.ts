import moment from 'moment';

export function yearMonthDay(date: Date | string) {
  return moment(date).format('yyyy-MM-DD');
}

export function formatDateToMonthDayAndYear(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

