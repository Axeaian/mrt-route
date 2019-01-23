import React, { Component } from "react";
import "./App.css";
import myData from "./stations.json";
import Landing from "./components/landing";
import Search from "./components/search";
import Results from "./components/results";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: "",
      end: ""
    };
  }

  updateReference = arr => {
    this.setState({
      start: arr[0],
      end: arr[1]
    });
  };

  render() {
    let data = Object.keys(myData);
    const { start, end } = this.state;
    return (
      <div className="App">
        <Landing />
        <Search data={data} updateRef={this.updateReference} />
        <Results start={start} end={end} allStations={myData} />
      </div>
    );
  }
}

export default App;
