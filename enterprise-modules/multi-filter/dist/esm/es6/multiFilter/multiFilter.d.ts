import { AgPromise, ProvidedFilterModel, IDoesFilterPassParams, IAfterGuiAttachedParams, IFilterComp, IMultiFilterDef, MultiFilterParams, IMultiFilterModel, TabGuardComp, IMultiFilter } from '@ag-grid-community/core';
export declare class MultiFilter extends TabGuardComp implements IFilterComp, IMultiFilter {
    private readonly filterManager;
    private readonly userComponentFactory;
    private params;
    private filterDefs;
    private filters;
    private guiDestroyFuncs;
    private column;
    private filterChangedCallback;
    private lastOpenedInContainer?;
    private activeFilterIndices;
    private lastActivatedMenuItem;
    private afterFiltersReadyFuncs;
    constructor();
    private postConstruct;
    static getFilterDefs(params: MultiFilterParams): IMultiFilterDef[];
    init(params: MultiFilterParams): AgPromise<void>;
    private refreshGui;
    private getFilterTitle;
    private destroyChildren;
    private insertFilterMenu;
    private insertFilterGroup;
    isFilterActive(): boolean;
    getLastActiveFilterIndex(): number | null;
    doesFilterPass(params: IDoesFilterPassParams, filterToSkip?: IFilterComp): boolean;
    private getFilterType;
    getModelFromUi(): IMultiFilterModel | null;
    getModel(): ProvidedFilterModel | null;
    setModel(model: IMultiFilterModel | null): AgPromise<void>;
    applyModel(): boolean;
    getChildFilterInstance(index: number): IFilterComp | undefined;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
    onAnyFilterChanged(): void;
    onNewRowsLoaded(): void;
    destroy(): void;
    private executeFunctionIfExists;
    private createFilter;
    private executeWhenAllFiltersReady;
    private updateActiveList;
    private filterChanged;
    protected onFocusIn(e: FocusEvent): boolean;
}
