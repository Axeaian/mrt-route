import React, { Component } from "react";

export default class Card extends Component {
  displayRoute = route => {
    const container = [];
    for (let i = 0; i < route.length; i++) {
      i % 2 === 0
        ? container.push(
            <p key={i} className="line">
              On <span className={`${route[i]} label`}>{route[i]}-line</span>,
              take from
            </p>
          )
        : container.push(
            <p className="route" key={i}>
              {route[i]}
            </p>
          );
    }
    return container;
  };
  render() {
    const { route } = this.props;
    return <div className="card">{this.displayRoute(route)}</div>;
  }
}
