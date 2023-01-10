/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v29.0.0
 * @link https://www.ag-grid.com/
 * @license MIT
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BeanStub } from "../context/beanStub";
import { Bean } from "../context/context";
import { Events } from "../events";
var ColumnHoverService = /** @class */ (function (_super) {
    __extends(ColumnHoverService, _super);
    function ColumnHoverService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnHoverService.prototype.setMouseOver = function (columns) {
        this.selectedColumns = columns;
        var event = {
            type: Events.EVENT_COLUMN_HOVER_CHANGED
        };
        this.eventService.dispatchEvent(event);
    };
    ColumnHoverService.prototype.clearMouseOver = function () {
        this.selectedColumns = null;
        var event = {
            type: Events.EVENT_COLUMN_HOVER_CHANGED
        };
        this.eventService.dispatchEvent(event);
    };
    ColumnHoverService.prototype.isHovered = function (column) {
        return !!this.selectedColumns && this.selectedColumns.indexOf(column) >= 0;
    };
    ColumnHoverService = __decorate([
        Bean('columnHoverService')
    ], ColumnHoverService);
    return ColumnHoverService;
}(BeanStub));
export { ColumnHoverService };
