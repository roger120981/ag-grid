var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Series, SeriesNodeClickEvent, } from '../series';
import { ChartAxisDirection } from '../../chartAxis';
import { SeriesMarker } from '../seriesMarker';
import { isContinuous, isDiscrete } from '../../../util/value';
import { Path } from '../../../scene/shape/path';
import { Selection } from '../../../scene/selection';
import { Group } from '../../../scene/group';
import { RedrawType } from '../../../scene/changeDetectable';
import { CategoryAxis } from '../../axis/categoryAxis';
import { Layers } from '../../layers';
import { OPT_FUNCTION, ValidateAndChangeDetection } from '../../../util/validation';
import { jsonDiff } from '../../../util/json';
export class CartesianSeriesNodeClickEvent extends SeriesNodeClickEvent {
    constructor(xKey, yKey, nativeEvent, datum, series) {
        super(nativeEvent, datum, series);
        this.xKey = xKey;
        this.yKey = yKey;
    }
}
export class CartesianSeries extends Series {
    constructor(opts = {}) {
        super({ useSeriesGroupLayer: true, pickModes: opts.pickModes });
        this._contextNodeData = [];
        this.nodeDataDependencies = {};
        this.highlightSelection = Selection.select(this.highlightNode).selectAll();
        this.highlightLabelSelection = Selection.select(this.highlightLabel).selectAll();
        this.subGroups = [];
        this.subGroupId = 0;
        /**
         * The assumption is that the values will be reset (to `true`)
         * in the {@link yKeys} setter.
         */
        this.seriesItemEnabled = new Map();
        this.directionKeys = {
            [ChartAxisDirection.X]: ['xKey'],
            [ChartAxisDirection.Y]: ['yKey'],
        };
        const { pathsPerSeries = 1, hasMarkers = false, pathsZIndexSubOrderOffset = [], renderLayerPerSubSeries = true, } = opts;
        this.opts = { pathsPerSeries, hasMarkers, pathsZIndexSubOrderOffset, renderLayerPerSubSeries };
    }
    get contextNodeData() {
        var _a;
        return (_a = this._contextNodeData) === null || _a === void 0 ? void 0 : _a.slice();
    }
    destroy() {
        super.destroy();
        this._contextNodeData.splice(0, this._contextNodeData.length);
        this.subGroups.splice(0, this.subGroups.length);
    }
    /**
     * Note: we are passing `isContinuousX` and `isContinuousY` into this method because it will
     *       typically be called inside a loop and this check only needs to happen once.
     * @param x A domain value to be plotted along the x-axis.
     * @param y A domain value to be plotted along the y-axis.
     * @param isContinuousX Typically this will be the value of `xAxis.scale instanceof ContinuousScale`.
     * @param isContinuousY Typically this will be the value of `yAxis.scale instanceof ContinuousScale`.
     * @returns `[x, y]`, if both x and y are valid domain values for their respective axes/scales, or `undefined`.
     */
    checkDomainXY(x, y, isContinuousX, isContinuousY) {
        const isValidDatum = ((isContinuousX && isContinuous(x)) || (!isContinuousX && isDiscrete(x))) &&
            ((isContinuousY && isContinuous(y)) || (!isContinuousY && isDiscrete(y)));
        return isValidDatum ? [x, y] : undefined;
    }
    /**
     * Note: we are passing the xAxis and yAxis because the calling code is supposed to make sure
     *       that series has both of them defined, and also to avoid one level of indirection,
     *       e.g. `this.xAxis!.inRange(x)`, both of which are suboptimal in tight loops where this method is used.
     * @param x A range value to be plotted along the x-axis.
     * @param y A range value to be plotted along the y-axis.
     * @param xAxis The series' x-axis.
     * @param yAxis The series' y-axis.
     * @returns
     */
    checkRangeXY(x, y, xAxis, yAxis) {
        return !isNaN(x) && !isNaN(y) && xAxis.inRange(x) && yAxis.inRange(y);
    }
    update({ seriesRect }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { seriesItemEnabled, visible } = this;
            const { series } = (_b = (_a = this.highlightManager) === null || _a === void 0 ? void 0 : _a.getActiveHighlight()) !== null && _b !== void 0 ? _b : {};
            const seriesHighlighted = series ? series === this : undefined;
            const anySeriesItemEnabled = (visible && seriesItemEnabled.size === 0) || [...seriesItemEnabled.values()].some((v) => v === true);
            const newNodeDataDependencies = {
                seriesRectWidth: seriesRect === null || seriesRect === void 0 ? void 0 : seriesRect.width,
                seriesRectHeight: seriesRect === null || seriesRect === void 0 ? void 0 : seriesRect.height,
            };
            if (jsonDiff(this.nodeDataDependencies, newNodeDataDependencies) != null) {
                this.nodeDataDependencies = newNodeDataDependencies;
                this.markNodeDataDirty();
            }
            yield this.updateSelections(seriesHighlighted, anySeriesItemEnabled);
            yield this.updateNodes(seriesHighlighted, anySeriesItemEnabled);
        });
    }
    updateSelections(seriesHighlighted, anySeriesItemEnabled) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateHighlightSelection(seriesHighlighted);
            if (!anySeriesItemEnabled) {
                return;
            }
            if (!this.nodeDataRefresh && !this.isPathOrSelectionDirty()) {
                return;
            }
            if (this.nodeDataRefresh) {
                this.nodeDataRefresh = false;
                this._contextNodeData = yield this.createNodeData();
                yield this.updateSeriesGroups();
            }
            yield Promise.all(this.subGroups.map((g, i) => this.updateSeriesGroupSelections(g, i, seriesHighlighted)));
        });
    }
    updateSeriesGroupSelections(subGroup, seriesIdx, seriesHighlighted) {
        return __awaiter(this, void 0, void 0, function* () {
            const { datumSelection, labelSelection, markerSelection, paths } = subGroup;
            const contextData = this._contextNodeData[seriesIdx];
            const { nodeData, labelData, itemId } = contextData;
            yield this.updatePaths({ seriesHighlighted, itemId, contextData, paths, seriesIdx });
            subGroup.datumSelection = yield this.updateDatumSelection({ nodeData, datumSelection, seriesIdx });
            subGroup.labelSelection = yield this.updateLabelSelection({ labelData, labelSelection, seriesIdx });
            if (markerSelection) {
                subGroup.markerSelection = yield this.updateMarkerSelection({
                    nodeData,
                    markerSelection,
                    seriesIdx,
                });
            }
        });
    }
    updateSeriesGroups() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { _contextNodeData: contextNodeData, contentGroup, subGroups, opts: { pathsPerSeries, hasMarkers, pathsZIndexSubOrderOffset, renderLayerPerSubSeries }, } = this;
            if (contextNodeData.length === subGroups.length) {
                return;
            }
            if (contextNodeData.length < subGroups.length) {
                subGroups.splice(contextNodeData.length).forEach(({ dataNodeGroup, markerGroup, labelGroup, paths }) => {
                    contentGroup.removeChild(dataNodeGroup);
                    if (markerGroup) {
                        contentGroup.removeChild(markerGroup);
                    }
                    if (labelGroup) {
                        contentGroup.removeChild(labelGroup);
                    }
                    for (const path of paths) {
                        contentGroup.removeChild(path);
                    }
                });
            }
            const totalGroups = contextNodeData.length;
            while (totalGroups > subGroups.length) {
                const layer = renderLayerPerSubSeries;
                const subGroupId = this.subGroupId++;
                const subGroupZOffset = subGroupId;
                const dataNodeGroup = new Group({
                    name: `${this.id}-series-sub${subGroupId}-dataNodes`,
                    layer,
                    zIndex: Layers.SERIES_LAYER_ZINDEX,
                    zIndexSubOrder: [this.id, subGroupZOffset],
                });
                const markerGroup = hasMarkers
                    ? new Group({
                        name: `${this.id}-series-sub${this.subGroupId++}-markers`,
                        layer,
                        zIndex: Layers.SERIES_LAYER_ZINDEX,
                        zIndexSubOrder: [this.id, 10000 + subGroupId],
                    })
                    : undefined;
                const labelGroup = new Group({
                    name: `${this.id}-series-sub${this.subGroupId++}-labels`,
                    layer,
                    zIndex: Layers.SERIES_LABEL_ZINDEX,
                    zIndexSubOrder: [this.id, subGroupId],
                });
                contentGroup.appendChild(dataNodeGroup);
                contentGroup.appendChild(labelGroup);
                if (markerGroup) {
                    contentGroup.appendChild(markerGroup);
                }
                const pathParentGroup = renderLayerPerSubSeries ? dataNodeGroup : contentGroup;
                const paths = [];
                for (let index = 0; index < pathsPerSeries; index++) {
                    paths[index] = new Path();
                    paths[index].zIndex = Layers.SERIES_LAYER_ZINDEX;
                    paths[index].zIndexSubOrder = [this.id, ((_a = pathsZIndexSubOrderOffset[index]) !== null && _a !== void 0 ? _a : 0) + subGroupZOffset];
                    pathParentGroup.appendChild(paths[index]);
                }
                subGroups.push({
                    paths,
                    dataNodeGroup,
                    markerGroup,
                    labelGroup,
                    labelSelection: Selection.select(labelGroup).selectAll(),
                    datumSelection: Selection.select(dataNodeGroup).selectAll(),
                    markerSelection: markerGroup ? Selection.select(markerGroup).selectAll() : undefined,
                });
            }
        });
    }
    updateNodes(seriesHighlighted, anySeriesItemEnabled) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { highlightSelection, highlightLabelSelection, _contextNodeData: contextNodeData, seriesItemEnabled, opts: { hasMarkers, renderLayerPerSubSeries }, } = this;
            const visible = this.visible && ((_a = this._contextNodeData) === null || _a === void 0 ? void 0 : _a.length) > 0 && anySeriesItemEnabled;
            this.rootGroup.visible = visible;
            this.contentGroup.visible = visible;
            this.highlightGroup.visible = visible && !!seriesHighlighted;
            const seriesOpacity = this.getOpacity();
            const subGroupOpacities = this.subGroups.map((_, index) => {
                const { itemId } = contextNodeData[index];
                return this.getOpacity({ itemId });
            });
            const isSubGroupOpacityDifferent = subGroupOpacities.some((subOp) => subOp !== seriesOpacity);
            this.contentGroup.opacity = isSubGroupOpacityDifferent ? 1 : seriesOpacity;
            if (hasMarkers) {
                yield this.updateMarkerNodes({
                    markerSelection: highlightSelection,
                    isHighlight: true,
                    seriesIdx: -1,
                });
            }
            else {
                yield this.updateDatumNodes({ datumSelection: highlightSelection, isHighlight: true, seriesIdx: -1 });
            }
            yield this.updateLabelNodes({ labelSelection: highlightLabelSelection, seriesIdx: -1 });
            yield Promise.all(this.subGroups.map((subGroup, seriesIdx) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                const { dataNodeGroup, markerGroup, datumSelection, labelSelection, markerSelection, paths, labelGroup, } = subGroup;
                const { itemId } = contextNodeData[seriesIdx];
                const subGroupVisible = visible && ((_b = seriesItemEnabled.get(itemId)) !== null && _b !== void 0 ? _b : true);
                const subGroupOpacity = isSubGroupOpacityDifferent ? subGroupOpacities[seriesIdx] : 1;
                dataNodeGroup.opacity = subGroupOpacity;
                dataNodeGroup.visible = subGroupVisible;
                labelGroup.visible = subGroupVisible;
                if (markerGroup) {
                    markerGroup.opacity = subGroupOpacity;
                    markerGroup.zIndex =
                        dataNodeGroup.zIndex >= Layers.SERIES_LAYER_ZINDEX
                            ? dataNodeGroup.zIndex
                            : dataNodeGroup.zIndex + 1;
                    markerGroup.visible = subGroupVisible;
                }
                if (labelGroup) {
                    labelGroup.opacity = subGroupOpacity;
                }
                for (const path of paths) {
                    if (!renderLayerPerSubSeries) {
                        path.opacity = subGroupOpacity;
                        path.visible = subGroupVisible;
                    }
                }
                if (!dataNodeGroup.visible) {
                    return;
                }
                yield this.updatePathNodes({ seriesHighlighted, itemId, paths, seriesIdx });
                yield this.updateDatumNodes({ datumSelection, isHighlight: false, seriesIdx });
                yield this.updateLabelNodes({ labelSelection, seriesIdx });
                if (hasMarkers && markerSelection) {
                    yield this.updateMarkerNodes({ markerSelection, isHighlight: false, seriesIdx });
                }
            })));
        });
    }
    updateHighlightSelection(seriesHighlighted) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { highlightSelection, highlightLabelSelection, _contextNodeData: contextNodeData } = this;
            const highlightedDatum = (_a = this.highlightManager) === null || _a === void 0 ? void 0 : _a.getActiveHighlight();
            const item = seriesHighlighted && (highlightedDatum === null || highlightedDatum === void 0 ? void 0 : highlightedDatum.datum) ? highlightedDatum : undefined;
            this.highlightSelection = yield this.updateHighlightSelectionItem({ item, highlightSelection });
            let labelItem;
            if (this.isLabelEnabled() && item != null) {
                const { itemId = undefined } = item;
                for (const { labelData } of contextNodeData) {
                    labelItem = labelData.find((ld) => ld.datum === item.datum && ld.itemId === itemId);
                    if (labelItem != null) {
                        break;
                    }
                }
            }
            this.highlightLabelSelection = yield this.updateHighlightSelectionLabel({
                item: labelItem,
                highlightLabelSelection,
            });
        });
    }
    pickNodeExactShape(point) {
        let result = super.pickNodeExactShape(point);
        if (result) {
            return result;
        }
        const { x, y } = point;
        const { opts: { hasMarkers }, } = this;
        for (const { dataNodeGroup, markerGroup } of this.subGroups) {
            let match = dataNodeGroup.pickNode(x, y);
            if (!match && hasMarkers) {
                match = markerGroup === null || markerGroup === void 0 ? void 0 : markerGroup.pickNode(x, y);
            }
            if (match) {
                return { datum: match.datum, distance: 0 };
            }
        }
    }
    pickNodeClosestDatum(point) {
        var _a, _b;
        const { x, y } = point;
        const { xAxis, yAxis, rootGroup, _contextNodeData: contextNodeData } = this;
        const hitPoint = rootGroup.transformPoint(x, y);
        let minDistance = Infinity;
        let closestDatum;
        for (const context of contextNodeData) {
            for (const datum of context.nodeData) {
                const { point: { x: datumX = NaN, y: datumY = NaN } = {} } = datum;
                if (isNaN(datumX) || isNaN(datumY)) {
                    continue;
                }
                const isInRange = (xAxis === null || xAxis === void 0 ? void 0 : xAxis.inRange(datumX)) && (yAxis === null || yAxis === void 0 ? void 0 : yAxis.inRange(datumY));
                if (!isInRange) {
                    continue;
                }
                // No need to use Math.sqrt() since x < y implies Math.sqrt(x) < Math.sqrt(y) for
                // values > 1
                const distance = Math.max(Math.pow((hitPoint.x - datumX), 2) + Math.pow((hitPoint.y - datumY), 2), 0);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDatum = datum;
                }
            }
        }
        if (closestDatum) {
            const distance = Math.max(Math.sqrt(minDistance) - ((_b = (_a = closestDatum.point) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0), 0);
            return { datum: closestDatum, distance };
        }
    }
    pickNodeMainAxisFirst(point, requireCategoryAxis) {
        var _a, _b;
        const { x, y } = point;
        const { xAxis, yAxis, rootGroup, _contextNodeData: contextNodeData } = this;
        // Prefer to start search with any available category axis.
        const directions = [xAxis, yAxis]
            .filter((a) => a instanceof CategoryAxis)
            .map((a) => a.direction);
        if (requireCategoryAxis && directions.length === 0) {
            return;
        }
        // Default to X-axis unless we found a suitable category axis.
        const [primaryDirection = ChartAxisDirection.X] = directions;
        const hitPoint = rootGroup.transformPoint(x, y);
        const hitPointCoords = primaryDirection === ChartAxisDirection.X ? [hitPoint.x, hitPoint.y] : [hitPoint.y, hitPoint.x];
        let minDistance = [Infinity, Infinity];
        let closestDatum = undefined;
        for (const context of contextNodeData) {
            for (const datum of context.nodeData) {
                const { point: { x: datumX = NaN, y: datumY = NaN } = {} } = datum;
                if (isNaN(datumX) || isNaN(datumY)) {
                    continue;
                }
                const isInRange = (xAxis === null || xAxis === void 0 ? void 0 : xAxis.inRange(datumX)) && (yAxis === null || yAxis === void 0 ? void 0 : yAxis.inRange(datumY));
                if (!isInRange) {
                    continue;
                }
                const point = primaryDirection === ChartAxisDirection.X ? [datumX, datumY] : [datumY, datumX];
                // Compare distances from most significant dimension to least.
                let newMinDistance = true;
                for (let i = 0; i < point.length; i++) {
                    const dist = Math.abs(point[i] - hitPointCoords[i]);
                    if (dist > minDistance[i]) {
                        newMinDistance = false;
                        break;
                    }
                    if (dist < minDistance[i]) {
                        minDistance[i] = dist;
                        minDistance.fill(Infinity, i + 1, minDistance.length);
                    }
                }
                if (newMinDistance) {
                    closestDatum = datum;
                }
            }
        }
        if (closestDatum) {
            const distance = Math.max(Math.sqrt(Math.pow(minDistance[0], 2) + Math.pow(minDistance[1], 2)) - ((_b = (_a = closestDatum.point) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0), 0);
            return { datum: closestDatum, distance };
        }
    }
    toggleSeriesItem(itemId, enabled) {
        if (this.seriesItemEnabled.size > 0) {
            this.seriesItemEnabled.set(itemId, enabled);
            this.nodeDataRefresh = true;
        }
        else {
            super.toggleSeriesItem(itemId, enabled);
        }
    }
    isEnabled() {
        if (this.seriesItemEnabled.size > 0) {
            for (const [, enabled] of this.seriesItemEnabled) {
                if (enabled) {
                    return true;
                }
            }
            return false;
        }
        return super.isEnabled();
    }
    isPathOrSelectionDirty() {
        // Override point to allow more sophisticated dirty selection detection.
        return false;
    }
    getLabelData() {
        return [];
    }
    updatePaths(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Override point for sub-classes.
            opts.paths.forEach((p) => (p.visible = false));
        });
    }
    updatePathNodes(_opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Override point for sub-classes.
        });
    }
    updateHighlightSelectionItem(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { opts: { hasMarkers }, } = this;
            const { item, highlightSelection } = opts;
            const nodeData = item ? [item] : [];
            if (hasMarkers) {
                const markerSelection = highlightSelection;
                return this.updateMarkerSelection({ nodeData, markerSelection, seriesIdx: -1 });
            }
            else {
                return this.updateDatumSelection({ nodeData, datumSelection: highlightSelection, seriesIdx: -1 });
            }
        });
    }
    updateHighlightSelectionLabel(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { item, highlightLabelSelection } = opts;
            const labelData = item ? [item] : [];
            return this.updateLabelSelection({ labelData, labelSelection: highlightLabelSelection, seriesIdx: -1 });
        });
    }
    updateDatumSelection(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Override point for sub-classes.
            return opts.datumSelection;
        });
    }
    updateDatumNodes(_opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Override point for sub-classes.
        });
    }
    updateMarkerSelection(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Override point for sub-classes.
            return opts.markerSelection;
        });
    }
    updateMarkerNodes(_opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Override point for sub-classes.
        });
    }
}
export class CartesianSeriesMarker extends SeriesMarker {
    constructor() {
        super(...arguments);
        this.formatter = undefined;
    }
}
__decorate([
    ValidateAndChangeDetection({
        validatePredicate: OPT_FUNCTION,
        sceneChangeDetectionOpts: { redraw: RedrawType.MAJOR },
    })
], CartesianSeriesMarker.prototype, "formatter", void 0);
