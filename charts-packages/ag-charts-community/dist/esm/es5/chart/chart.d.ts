import { Scene } from '../scene/scene';
import { Group } from '../scene/group';
import { Series, SeriesNodeDatum } from './series/series';
import { Padding } from '../util/padding';
import { Background } from './background';
import { Legend } from './legend';
import { BBox } from '../scene/bbox';
import { Caption } from '../caption';
import { Observable } from '../util/observable';
import { ChartAxis } from './chartAxis';
import { PlacedLabel } from '../util/labelPlacement';
import { AgChartOptions, AgChartInstance } from './agChartOptions';
import { Tooltip } from './tooltip/tooltip';
import { InteractionEvent, InteractionManager } from './interaction/interactionManager';
import { ClipRect } from '../scene/clipRect';
import { CursorManager } from './interaction/cursorManager';
import { HighlightChangeEvent, HighlightManager } from './interaction/highlightManager';
/** Types of chart-update, in pipeline execution order. */
export declare enum ChartUpdateType {
    FULL = 0,
    PROCESS_DATA = 1,
    PERFORM_LAYOUT = 2,
    SERIES_UPDATE = 3,
    SCENE_RENDER = 4,
    NONE = 5
}
declare type OptionalHTMLElement = HTMLElement | undefined | null;
export declare type TransferableResources = {
    container?: OptionalHTMLElement;
    scene: Scene;
    element: HTMLElement;
};
export declare abstract class Chart extends Observable implements AgChartInstance {
    readonly id: string;
    processedOptions: AgChartOptions;
    userOptions: AgChartOptions;
    queuedUserOptions: AgChartOptions[];
    getOptions(): AgChartOptions;
    readonly scene: Scene;
    readonly seriesRoot: ClipRect;
    readonly background: Background;
    readonly legend: Legend;
    readonly tooltip: Tooltip;
    private _debug;
    set debug(value: boolean);
    get debug(): boolean;
    private extraDebugStats;
    private _container;
    set container(value: OptionalHTMLElement);
    get container(): OptionalHTMLElement;
    protected _data: any;
    set data(data: any);
    get data(): any;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    private _lastAutoSize?;
    protected _autoSize: boolean;
    set autoSize(value: boolean);
    get autoSize(): boolean;
    download(fileName?: string, fileFormat?: string): void;
    padding: Padding;
    _title?: Caption;
    set title(caption: Caption | undefined);
    get title(): Caption | undefined;
    _subtitle?: Caption;
    set subtitle(caption: Caption | undefined);
    get subtitle(): Caption | undefined;
    private _destroyed;
    get destroyed(): boolean;
    protected readonly interactionManager: InteractionManager;
    protected readonly cursorManager: CursorManager;
    protected readonly highlightManager: HighlightManager;
    protected readonly axisGroup: Group;
    protected constructor(document?: Document, overrideDevicePixelRatio?: number, resources?: TransferableResources);
    destroy(opts?: {
        keepTransferableResources: boolean;
    }): TransferableResources | undefined;
    log(opts: any): void;
    togglePointer(visible?: boolean): void;
    private _pendingFactoryUpdates;
    requestFactoryUpdate(cb: () => Promise<void>): void;
    private _processCallbacks;
    private _performUpdateNoRenderCount;
    private _performUpdateType;
    get performUpdateType(): ChartUpdateType;
    get updatePending(): boolean;
    private _lastPerformUpdateError?;
    get lastPerformUpdateError(): Error | undefined;
    private seriesToUpdate;
    private performUpdateTrigger;
    awaitUpdateCompletion(): Promise<void>;
    update(type?: ChartUpdateType, opts?: {
        forceNodeDataRefresh?: boolean;
        seriesToUpdate?: Iterable<Series>;
    }): void;
    private performUpdate;
    readonly element: HTMLElement;
    protected _axes: ChartAxis[];
    set axes(values: ChartAxis[]);
    get axes(): ChartAxis[];
    protected _series: Series[];
    set series(values: Series[]);
    get series(): Series[];
    addSeries(series: Series<any>, before?: Series<any>): boolean;
    protected initSeries(series: Series<any>): void;
    protected freeSeries(series: Series<any>): void;
    removeAllSeries(): void;
    protected assignSeriesToAxes(): void;
    protected assignAxesToSeries(force?: boolean): void;
    private findMatchingAxis;
    private resize;
    processData(): Promise<void>;
    placeLabels(): Map<Series<any>, PlacedLabel[]>;
    private updateLegend;
    abstract performLayout(): Promise<void>;
    protected positionCaptions(shrinkRect: BBox): BBox;
    protected positionLegend(shrinkRect: BBox): BBox;
    private calculateLegendDimensions;
    protected seriesRect?: BBox;
    getSeriesRect(): Readonly<BBox | undefined>;
    private pickSeriesNode;
    lastPick?: {
        datum: SeriesNodeDatum;
        event?: Event;
    };
    protected onMouseMove(event: InteractionEvent<'hover'>): void;
    private disablePointer;
    private lastInteractionEvent?;
    private pointerScheduler;
    protected handlePointer(event: InteractionEvent<'hover'>): void;
    protected onClick(event: InteractionEvent<'click'>): void;
    private checkSeriesNodeClick;
    private onSeriesNodeClick;
    private onSeriesDatumPick;
    private mergePointerDatum;
    changeHighlightDatum(event: HighlightChangeEvent): void;
    waitForUpdate(timeoutMs?: number): Promise<void>;
}
export {};
