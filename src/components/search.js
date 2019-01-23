import React, { Component } from "react";
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: ""
    };
  }

  handeClick = e => {
    e.preventDefault();
    this.props.updateRef([this.state.from, this.state.to]);
    this.setState({ from: "", to: "" });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { from, to } = this.state;
    const isInvalid = from === to || from === "" || to === "";
    return (
      <div className="search">
        <div className="search-title">Find Route</div>
        <div className="search-container">
          <div className="searchbox">
            <p>From:</p>
            <select
              name="from"
              className="dropdownbox"
              value={this.state.from}
              onChange={this.handleChange}
            >
              <option value="" disabled />
              {this.props.data.map(station => (
                <option value={station} key={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
          <div className="searchbox">
            <p>To:</p>
            <select
              name="to"
              className="dropdownbox"
              value={this.state.to}
              onChange={this.handleChange}
            >
              <option value="" disabled />
              {this.props.data.map(station => (
                <option value={station} key={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
          <button
            className="submit"
            onClick={this.handeClick}
            disabled={isInvalid}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
