import moment from 'moment';

export const getParam = (time: string) => {
  const currentDate = moment(new Date(time));
  const timeFirstDay = currentDate.startOf('month').format('YYYY-MM-DD');
  const numberOfDayInMonth = currentDate.daysInMonth();
  const timeLastDay = currentDate.endOf('month').format('YYYY-MM-DD');

  // weekDayFirstOfMonth is needed to place the 1 day of the month at the right place
  // if weekDayFirstOfMonth is Sunday than means it should be 7 to match the Grid implementation
  // Grid is : Mo Tu We Th Fr Sa Su not Su Mo Tu We Th Fr Sa

  const weekDayFirstOfMonth =
    moment(new Date(timeFirstDay)).weekday() === 0 ? 7 : moment(new Date(timeFirstDay)).weekday();

  const weekDayLastOfMonth =
    moment(new Date(timeLastDay)).weekday() === 0 ? 7 : moment(new Date(timeLastDay)).weekday();

  // an array with as much element we have from Monday till weekDayFirstOfMonth
  // this array is needed to loop through it and get all the previous day from the 1st of month till fist Monday last month.
  const prevMonthDays: number[] = Array.from({ length: weekDayFirstOfMonth - 1 }, (v, i) => i);
  const nextMonthDays: number[] = Array.from({ length: 7 - weekDayLastOfMonth }, (v, i) => i);

  const result = {
    today: moment().format('YYYY-MM-DD'),
    year: currentDate.year(),
    fullMonth: currentDate.format('MMMM'),
    numberOfDayInMonth,
    timeFirstDay,
    prevMonthDays,
    timeLastDay,
    nextMonthDays,
  };

  return result;
};
