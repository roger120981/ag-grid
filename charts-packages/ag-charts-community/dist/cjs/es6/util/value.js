"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.checkDatum = exports.isContinuous = exports.isDiscrete = exports.isDate = exports.isStringObject = exports.isString = void 0;
exports.isString = (v) => typeof v === 'string';
exports.isStringObject = (v) => !!v && v.hasOwnProperty('toString') && exports.isString(v.toString());
exports.isDate = (v) => v instanceof Date && !isNaN(+v);
function isDiscrete(value) {
    if (exports.isString(value)) {
        return true;
    }
    else if (exports.isStringObject(value)) {
        return true;
    }
    return false;
}
exports.isDiscrete = isDiscrete;
function isContinuous(value) {
    const isNumberObject = (v) => !!v && v.hasOwnProperty('valueOf') && exports.isNumber(v.valueOf());
    const isDate = (v) => v instanceof Date && !isNaN(+v);
    if (exports.isNumber(value)) {
        return true;
    }
    else if (isNumberObject(value)) {
        return true;
    }
    else if (isDate(value)) {
        return true;
    }
    return false;
}
exports.isContinuous = isContinuous;
function checkDatum(value, isContinuousScale) {
    if (isContinuousScale && isContinuous(value)) {
        return value;
    }
    else if (!isContinuousScale) {
        if (!isDiscrete(value)) {
            return String(value);
        }
        return value;
    }
    return undefined;
}
exports.checkDatum = checkDatum;
exports.isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
