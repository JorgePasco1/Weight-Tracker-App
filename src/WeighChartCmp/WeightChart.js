import React, { Component } from "react";
import Chart from "chart.js";
import classes from "./WeightChart.module.css";

let myLineChart;

export default class WeightChart extends Component {
  chartRef = React.createRef();

  componentDidMount() {
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

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(weightChartRef, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Weight Records",
            data: chartData,
            fill: false,
            borderColor: "#0F52BA"
          }
        ]
      }
    });
  };
}
