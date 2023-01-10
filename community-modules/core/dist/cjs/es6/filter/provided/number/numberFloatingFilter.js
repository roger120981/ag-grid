/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v29.0.0
 * @link https://www.ag-grid.com/
 * @license MIT
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFloatingFilter = void 0;
const numberFilter_1 = require("./numberFilter");
const textInputFloatingFilter_1 = require("../../floating/provided/textInputFloatingFilter");
class NumberFloatingFilter extends textInputFloatingFilter_1.TextInputFloatingFilter {
    getDefaultFilterOptions() {
        return numberFilter_1.NumberFilter.DEFAULT_FILTER_OPTIONS;
    }
}
exports.NumberFloatingFilter = NumberFloatingFilter;
