import React, { Component } from "react";
import Chart from "chart.js";
import classes from "./WeightChart.module.css";

let myLineChart;

export default class WeightChart extends Component {
  chartRef = React.createRef();

  componentDidMount() {
    this.buildChart();
  }

  buildChart = () => {
    const weightChartRef = this.chartRef.current.getContext("2d");
    const { data, labels } = this.props;

    if (typeof myLineChart !== "undefined") myLineChart.destroy();

    myLineChart = new Chart(weightChartRef, {
      type: "line",
      data: {
        labels: [1, 2, 3],
        datasets: [
          {
            label: "Weight Records",
            data: [1, 3, 2],
            fill: false,
            borderColor: "#0F52BA"
          }
        ]
      }
    });
  };

  render() {
    return (
      <div className={classes.graphContainer}>
        <canvas id="weightChart" ref={this.chartRef} />
      </div>
    );
  }
}
