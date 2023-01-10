// Type definitions for @ag-grid-community/core v29.0.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { GridCtrl } from "./gridComp/gridCtrl";
import { GridBodyCtrl } from "./gridBodyComp/gridBodyCtrl";
import { RowContainerCtrl } from "./gridBodyComp/rowContainer/rowContainerCtrl";
import { BeanStub } from "./context/beanStub";
import { GridHeaderCtrl } from "./headerRendering/gridHeaderCtrl";
import { HeaderRowContainerCtrl } from "./headerRendering/rowContainer/headerRowContainerCtrl";
import { ColumnPinnedType } from "./entities/column";
import { FakeHScrollComp } from "./gridBodyComp/fakeHScrollComp";
import { FakeVScrollComp } from "./gridBodyComp/fakeVScrollComp";
interface ReadyParams {
    gridCtrl: GridCtrl;
    gridBodyCtrl: GridBodyCtrl;
    centerRowContainerCtrl: RowContainerCtrl;
    leftRowContainerCtrl: RowContainerCtrl;
    rightRowContainerCtrl: RowContainerCtrl;
    bottomCenterRowContainerCtrl: RowContainerCtrl;
    bottomLeftRowContainerCtrl: RowContainerCtrl;
    bottomRightRowContainerCtrl: RowContainerCtrl;
    topCenterRowContainerCtrl: RowContainerCtrl;
    topLeftRowContainerCtrl: RowContainerCtrl;
    topRightRowContainerCtrl: RowContainerCtrl;
    stickyTopCenterRowContainerCtrl: RowContainerCtrl;
    stickyTopLeftRowContainerCtrl: RowContainerCtrl;
    stickyTopRightRowContainerCtrl: RowContainerCtrl;
    fakeHScrollComp: FakeHScrollComp;
    fakeVScrollComp: FakeVScrollComp;
    gridHeaderCtrl: GridHeaderCtrl;
    centerHeaderRowContainerCtrl: HeaderRowContainerCtrl;
    leftHeaderRowContainerCtrl: HeaderRowContainerCtrl;
    rightHeaderRowContainerCtrl: HeaderRowContainerCtrl;
}
export declare class CtrlsService extends BeanStub {
    static readonly NAME = "ctrlsService";
    private gridCtrl;
    private gridBodyCtrl;
    private centerRowContainerCtrl;
    private leftRowContainerCtrl;
    private rightRowContainerCtrl;
    private bottomCenterRowContainerCtrl;
    private bottomLeftRowContainerCtrl;
    private bottomRightRowContainerCtrl;
    private topCenterRowContainerCtrl;
    private topLeftRowContainerCtrl;
    private topRightRowContainerCtrl;
    private stickyTopCenterRowContainerCtrl;
    private stickyTopLeftRowContainerCtrl;
    private stickyTopRightRowContainerCtrl;
    private centerHeaderRowContainerCtrl;
    private leftHeaderRowContainerCtrl;
    private rightHeaderRowContainerCtrl;
    private fakeHScrollComp;
    private fakeVScrollComp;
    private gridHeaderCtrl;
    private ready;
    private readyCallbacks;
    private checkReady;
    whenReady(callback: (p: ReadyParams) => void): void;
    private createReadyParams;
    registerFakeHScrollComp(comp: FakeHScrollComp): void;
    registerFakeVScrollComp(comp: FakeVScrollComp): void;
    registerGridHeaderCtrl(gridHeaderCtrl: GridHeaderCtrl): void;
    registerCenterRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerLeftRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerRightRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerTopCenterRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerTopLeftRowContainerCon(ctrl: RowContainerCtrl): void;
    registerTopRightRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerStickyTopCenterRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerStickyTopLeftRowContainerCon(ctrl: RowContainerCtrl): void;
    registerStickyTopRightRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerBottomCenterRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerBottomLeftRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerBottomRightRowContainerCtrl(ctrl: RowContainerCtrl): void;
    registerHeaderContainer(ctrl: HeaderRowContainerCtrl, pinned: ColumnPinnedType): void;
    registerGridBodyCtrl(ctrl: GridBodyCtrl): void;
    registerGridCtrl(ctrl: GridCtrl): void;
    getFakeHScrollComp(): FakeHScrollComp;
    getFakeVScrollComp(): FakeVScrollComp;
    getGridHeaderCtrl(): GridHeaderCtrl;
    getGridCtrl(): GridCtrl;
    getCenterRowContainerCtrl(): RowContainerCtrl;
    getTopCenterRowContainerCtrl(): RowContainerCtrl;
    getBottomCenterRowContainerCtrl(): RowContainerCtrl;
    getStickyTopCenterRowContainerCtrl(): RowContainerCtrl;
    getGridBodyCtrl(): GridBodyCtrl;
    getHeaderRowContainerCtrls(): HeaderRowContainerCtrl[];
    getHeaderRowContainerCtrl(pinned?: ColumnPinnedType): HeaderRowContainerCtrl;
}
export {};
