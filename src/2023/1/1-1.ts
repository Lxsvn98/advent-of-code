import fs from 'fs';
import path from 'path';

const data: string[] = fs.readFileSync(path.resolve(__dirname, './data.txt'), { encoding: 'utf-8' }).split('\n');

const digitRegex: RegExp = /\d/g;

const calibrationValuesSum: number = data
  .map(amendedCalibrationValue => {
    const digitMatches = amendedCalibrationValue.match(digitRegex)!;
    const [firstDigit, lastDigit] = [digitMatches[0], digitMatches[digitMatches.length - 1]];
    return parseInt(`${firstDigit}${lastDigit}`);
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(calibrationValuesSum);