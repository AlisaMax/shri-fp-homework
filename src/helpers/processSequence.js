/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import * as R from 'ramda';

const api = new Api();

const isLengthValid = R.both(
    R.pipe(R.length, R.gt(R.__, 2)),
    R.pipe(R.length, R.lt(R.__, 10))
);
const isPositive = R.pipe(Number, R.gt(R.__, 0));
const isNumber = R.test(/^[0-9]+\.?[0-9]*$/);

const validate = R.allPass([isLengthValid, isPositive, isNumber]);

const toBinaryApi = n => api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: n });
const getAnimalApi = id => api.get(`https://animals.tech/${id}`, {});

const processSequence = async ({ value, writeLog, handleSuccess, handleError }) => {
    writeLog(value);

    if (!validate(value)) {
        handleError('ValidationError');
        return;
    }

    try {
        const rounded = Math.round(Number(value));
        writeLog(rounded);

        const { result: binary } = await toBinaryApi(rounded);
        writeLog(binary);

        const len = R.length(binary);
        writeLog(len);

        const squared = len * len;
        writeLog(squared);

        const mod = squared % 3;
        writeLog(mod);

        const { result: animal } = await getAnimalApi(mod);
        handleSuccess(animal);
    } catch (e) {
        handleError('APIError');
    }
};

export default processSequence;
