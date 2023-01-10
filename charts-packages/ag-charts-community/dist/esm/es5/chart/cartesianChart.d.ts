import { Chart, TransferableResources } from './chart';
import { BBox } from '../scene/bbox';
import { Navigator } from './navigator/navigator';
export declare class CartesianChart extends Chart {
    static className: string;
    static type: 'cartesian' | 'groupedCategory';
    /** Integrated Charts feature state - not used in Standalone Charts. */
    readonly paired: boolean;
    constructor(document?: Document, overrideDevicePixelRatio?: number, resources?: TransferableResources);
    readonly navigator: Navigator;
    performLayout(): Promise<void>;
    private _lastAxisWidths;
    private _lastVisibility;
    updateAxes(inputShrinkRect: BBox): {
        seriesRect: BBox;
        visibility: {
            crossLines: boolean;
            series: boolean;
        };
    };
    private updateAxesPass;
    private buildCrossLinePadding;
    private buildAxisBound;
    private buildSeriesRect;
    private clampToOutsideSeriesRect;
    private calculateAxisDimensions;
    private positionAxis;
}
