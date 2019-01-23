import React, { Component } from "react";
import { getRoute } from "../functions";
import Card from "./Card";

export default class Results extends Component {
  state = {
    start: "",
    end: ""
  };
  componentDidMount() {
    this.setState({
      start: this.props.start,
      end: this.props.end
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      start: nextProps.start,
      end: nextProps.end,
      allStations: nextProps.allStations
    });
  }

  render() {
    const { start, end, allStations } = this.state;
    let isValid = start !== "" && end !== "";
    let result = getRoute(start, end, allStations);
    return (
      <div>
        {isValid && (
          <div className="results">
            <p className="results-title">
              Directions from {start} to {end}:
            </p>
            <div className="grid-container-3">
              {result.map((directions, i) => {
                return <Card key={i} route={directions} />;
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
