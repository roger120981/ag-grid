"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.findMinMax = exports.extent = exports.findIndex = exports.find = void 0;
// Custom `Array.find` implementation for legacy browsers.
function find(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        if (predicate(value, i, arr)) {
            return value;
        }
    }
}
exports.find = find;
function findIndex(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
function identity(value) {
    return value;
}
function extent(values, predicate, map) {
    const transform = map || identity;
    const n = values.length;
    let i = -1;
    let value;
    let min;
    let max;
    while (++i < n) {
        // Find the first value.
        value = values[i];
        if (predicate(value)) {
            min = max = value;
            while (++i < n) {
                // Compare the remaining values.
                value = values[i];
                if (predicate(value)) {
                    if (min > value) {
                        min = value;
                    }
                    if (max < value) {
                        max = value;
                    }
                }
            }
        }
    }
    return min === undefined || max === undefined ? undefined : [transform(min), transform(max)];
}
exports.extent = extent;
/**
 * finds the min and max using a process appropriate for stacked values. Ie,
 * summing up the positive and negative numbers, and returning the totals of each
 */
function findMinMax(values) {
    let min = undefined;
    let max = undefined;
    for (const value of values) {
        if (value < 0) {
            min = (min !== null && min !== void 0 ? min : 0) + value;
        }
        else if (value >= 0) {
            max = (max !== null && max !== void 0 ? max : 0) + value;
        }
    }
    return { min, max };
}
exports.findMinMax = findMinMax;
function copy(array, start = 0, count = array.length) {
    const result = [];
    let n = array.length;
    if (n) {
        for (let i = 0; i < count; i++) {
            result.push(array[(start + i) % n]);
        }
    }
    return result;
}
exports.copy = copy;
