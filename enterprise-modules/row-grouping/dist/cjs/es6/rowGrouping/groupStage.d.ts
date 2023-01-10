import { BeanStub, IRowNodeStage, StageExecuteParams } from "@ag-grid-community/core";
export declare class GroupStage extends BeanStub implements IRowNodeStage {
    private columnModel;
    private selectableService;
    private valueService;
    private beans;
    private selectionService;
    private usingTreeData;
    private getDataPath;
    private groupIdSequence;
    private oldGroupingDetails;
    private oldGroupDisplayColIds;
    private postConstruct;
    execute(params: StageExecuteParams): void;
    private positionLeafsAboveGroups;
    private createGroupingDetails;
    private handleTransaction;
    private sortChildren;
    private orderGroups;
    private getInitialGroupOrderComparator;
    private getExistingPathForNode;
    private moveNodesInWrongPath;
    private moveNode;
    private removeNodes;
    private removeNodesInStages;
    private forEachParentGroup;
    private removeNodesFromParents;
    private postRemoveCreateFillerNodes;
    private removeEmptyGroups;
    private removeFromParent;
    private addToParent;
    private areGroupColsEqual;
    private checkAllGroupDataAfterColsChanged;
    private shotgunResetEverything;
    private noChangeInGroupingColumns;
    private insertNodes;
    private insertOneNode;
    private findParentForNode;
    private swapGroupWithUserNode;
    private getOrCreateNextNode;
    private createGroup;
    private setGroupData;
    private getChildrenMappedKey;
    private setExpandedInitialValue;
    private getGroupInfo;
    private getGroupInfoFromCallback;
    private getGroupInfoFromGroupColumns;
}
