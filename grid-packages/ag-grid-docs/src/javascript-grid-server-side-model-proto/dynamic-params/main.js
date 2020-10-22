var gridOptions = {
    columnDefs: [
        { field: 'country', enableRowGroup: true, rowGroup: true },
        { field: "sport", enableRowGroup: true, rowGroup: true },
        { field: "year", minWidth: 100 },
        { field: "gold", aggFunc: 'sum' },
        { field: "silver", aggFunc: 'sum' },
        { field: "bronze", aggFunc: 'sum' }
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 120,
        resizable: true,
        sortable: true
    },
    rowGroupPanelShow: 'always',
    serverSideStoreType: 'clientSide',
    sideBar: ['columns'],
    autoGroupColumnDef: {
        flex: 1,
        minWidth: 280,
    },

    // rowBuffer: 0,
    cacheBlockSize: 4,

    // use the server-side row model
    rowModelType: 'serverSide',

    getServerSideStoreParams: function(params) {
        var topLevelRows = params.level==0;

        var res = {
            storeType: topLevelRows ? 'clientSide' : 'infinite',
            cacheBlockSize: params.level==1 ? 5 : 2,
            maxBlocksInCache: params.level==1 ? undefined : 2
        };

        return res;
    },

    suppressAggFuncInHeader: true,

    animateRows: true,
    // debug: true,
};

function ServerSideDatasource(server) {
    return {
        getRows: function(params) {
            console.log('[Datasource] - rows requested by grid: ', params.request);

            var response = server.getData(params.request);

            // adding delay to simulate real server call
            setTimeout(function() {
                if (response.success) {
                    // call the success callback
                    params.successCallback(response.rows, response.lastRow);
                } else {
                    // inform the grid request failed
                    params.failCallback();
                }
            }, 1000);
        }
    };
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json' }).then(function(data) {
        // setup the fake server with entire dataset
        var fakeServer = new FakeServer(data);

        // create datasource with a reference to the fake server
        var datasource = new ServerSideDatasource(fakeServer);

        // register the datasource with the grid
        gridOptions.api.setServerSideDatasource(datasource);
    });
});

