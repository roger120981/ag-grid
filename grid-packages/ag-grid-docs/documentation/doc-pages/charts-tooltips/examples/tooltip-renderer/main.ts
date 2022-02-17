import {
  AgCartesianSeriesTooltipRendererParams,
  AgChartOptions,
} from "@ag-grid-community/core"
import * as agCharts from "ag-charts-community"

function renderer(params: AgCartesianSeriesTooltipRendererParams) {
  return (
    '<div class="ag-chart-tooltip-title" style="background-color:' +
    params.color +
    '">' +
    params.xValue +
    "</div>" +
    '<div class="ag-chart-tooltip-content">' +
    params.yValue.toFixed(0) +
    "</div>"
  )
}

const options: AgChartOptions = {
  container: document.getElementById("myChart"),
  data: [
    {
      month: "Dec",
      sweaters: 50,
      hats: 40,
    },
    {
      month: "Jan",
      sweaters: 70,
      hats: 50,
    },
    {
      month: "Feb",
      sweaters: 60,
      hats: 30,
    },
  ],
  series: [
    {
      type: "column",
      xKey: "month",
      tooltip: { renderer: renderer },
      yKey: "sweaters",
      yName: "Sweaters made",
    },
    {
      type: "column",
      xKey: "month",
      tooltip: { renderer: renderer },
      yKey: "hats",
      yName: "Hats made",
    },
  ],
}

var chart = agCharts.AgChart.create(options)
