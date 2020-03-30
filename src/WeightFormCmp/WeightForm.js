import React, { Component } from "react";

export default class WeightForm extends Component {
  constructor() {
    super();
    this.state = {
      inputDate: "",
      inputWeight: ""
    };
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ inputDate: "", inputWeight: "" });
    this.props.registerEntry(this.state.inputDate, this.state.inputWeight);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            name="inputDate"
            type="date"
            value={this.state.inputDate}
            required
          />
          <input
            onChange={this.handleChange}
            name="inputWeight"
            type="number"
            value={this.state.inputWeight}
            required
          />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}
