// 1 min = 1000ms * 60 = 60,000
// 1h    = 60,000 * 60 = 3,600,000
// 1d    = 3,600,000 * 24 = 86,400,000
// 1y	 = 86,400,000 + ( 3,600,000 if bisextile)

// take a numeric time from 1970 and return an object with year, month and day as key value-pair
export const utcTime_to_date = (utcTime: number) => {
  const time = new Date(utcTime);
  const day: string = make2Digit(String(time.getDate()));
  const month: string = make2Digit(String(time.getMonth() + 1)); // getFullYear is 0 based.
  const year: string = make2Digit(String(time.getFullYear()));

  return {
    year,
    month,
    day,
  };
};

// convert day from one digit to a 2 char string
const make2Digit = (num: string): string => {
  return num.toString().length === 1 ? '0'.concat(num) : num;
};

const make1Digit = (num: string): number => {
  return num[0] === '0' ? +num[1] : +num;
};

export const getTimeFromDate = (dd: string, mm: string, yyyy: string) => {
  return new Date(`${yyyy}/${mm}/${dd}`).getTime();
};
const getMonth = (month: number) => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][month];
};
export const maxDayInMonth = (month: number) => {
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

export const isCurrentYearBisextile = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getParam = (time: number) => {
  const { year, month: monthStr, day: dayStr } = utcTime_to_date(time);
  const month = make1Digit(monthStr);
  const day = make1Digit(dayStr);

  // console.log(`getParam called year: ${year}/${month}/${day} `);
  // test is current year is bisextile and current month is February then return 1 day else 0;
  const handleBisextile = isCurrentYearBisextile(Number(year)) && month === 2 ? 1 : 0;

  const firstDay = `${year}/${month}/01`;
  const timeFirstDay = new Date(firstDay).getTime();
  const numberOfDayInMonth = maxDayInMonth(month - 1) + handleBisextile;
  const lastDay = `${year}/${month}/${maxDayInMonth(month - 1) + handleBisextile}`;
  const timeLastDay = new Date(lastDay).getTime();

  // weekDayFirstOfMonth is needed to place the 1 day of the month at the right place
  // if weekDayFirstOfMonth is Sunday than means it should be 7 to match the Grid implementation
  // Grid is : Mo Tu We Th Fr Sa Su not Su Mo Tu We Th Fr Sa
  const weekDayFirstOfMonth =
    new Date(`${year}/${month}/01`).getDay() === 0 ? 7 : new Date(`${year}/${month}/01`).getDay();
  const weekDayLastOfMonth =
    new Date(timeLastDay).getDay() === 0 ? 7 : new Date(timeLastDay).getDay();

  // an array with as much element we have from Monday till weekDayFirstOfMonth
  // this array is needed to loop through it and get all the previous day from the 1st of month till fist Monday last month.
  const prevMonthDays = Array.from({ length: weekDayFirstOfMonth - 1 }, (v, i) => i);
  const nextMonthDays = Array.from({ length: 7 - weekDayLastOfMonth }, (v, i) => i);

  return {
    year,
    month,
    day,
    fullMonth: getMonth(month - 1),
    numberOfDayInMonth,
    firstDay,
    timeFirstDay,
    weekDayFirstOfMonth,
    prevMonthDays,
    lastDay,
    timeLastDay,
    weekDayLastOfMonth,
    nextMonthDays,
  };
};
