import fs from 'fs';
import path from 'path';

const data: string[] = fs.readFileSync(path.resolve(__dirname, './data.txt'), { encoding: 'utf-8' }).split('\n');

const digitRegex: RegExp = /(?=(?<digit>\d|one|two|three|four|five|six|seven|eight|nine))/g;

const digitMap: Record<string | number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
};

const calibrationValuesSum: number = data
  .map(amendedCalibrationValue => {
    const digitMatches: number[] = [...amendedCalibrationValue.matchAll(digitRegex)].map((match) => digitMap[match.groups?.['digit']!]);
    const [firstDigit, lastDigit] = [digitMatches[0], digitMatches[digitMatches.length - 1]];
    return parseInt(`${firstDigit}${lastDigit}`);
  })
  .reduce((sum, calibrationValue) => sum + calibrationValue, 0);

console.log(calibrationValuesSum)