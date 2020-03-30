import React, { Component } from "react";
import Chart from "chart.js";
import classes from "./WeightChart.module.css";
import moment from "moment";

let myLineChart;

export default class WeightChart extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  render() {
    return (
      <div className={classes.graphContainer}>
        <canvas id="weightChart" ref={this.chartRef} />
      </div>
    );
  }

  buildChart = () => {
    const weightChartRef = this.chartRef.current.getContext("2d");
    const { chartLabels, chartData } = this.props;
    const chartDataMap = new Map();
    for (let i = 0; i < chartLabels.length; i++) {
      chartDataMap.set(chartLabels[i], chartData[i]);
    }
    const sortedChartDataMap = new Map([...chartDataMap.entries()].sort());
    const labelsArray = Array.from(sortedChartDataMap.keys()).map(date => moment(date).format("MMMM Do YY"));
    const dataArray = Array.from(sortedChartDataMap.values());


    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(weightChartRef, {
      type: "line",
      data: {
        labels: labelsArray,
        // labels: formattedAndSortedLabels,
        datasets: [
          {
            label: "Weight Records",
            data: dataArray,
            fill: false,
            borderColor: "#0F52BA"
          }
        ]
      }
    });
  };
}
