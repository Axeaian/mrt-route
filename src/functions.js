function filterStations(start, end, data) {
  let record = {};
  for (let station in data) {
    let line = Object.keys(data[station]);
    if (line.length > 1 || station === start || station === end) {
      record[station] = data[station];
    }
  }
  return record;
}

function updateRecord(record, line, index) {
  for (let i = 0; i < line.length; i++) {
    if (record[line[i]]) {
      index[i].length > 1
        ? record[line[i]].push(...index[i])
        : record[line[i]].push(index[i]);
    } else {
      record[line[i]] = [];
      index[i].length > 1
        ? record[line[i]].push(...index[i])
        : record[line[i]].push(index[i]);
    }
  }
}

function sortLines(data) {
  let record = {};
  for (let station in data) {
    let line = Object.keys(data[station]);
    let index = Object.values(data[station]);
    updateRecord(record, line, index);
  }
  for (let key in record) {
    record[key] = Object.values(record[key]).sort((a, b) => a - b);
  }
  return record;
}

function getStationCodes(data) {
  let record = {};
  for (let station in data) {
    let line = Object.keys(data[station]);
    let index = Object.values(data[station]);
    record[station] = [];
    for (let i = 0; i < line.length; i++) {
      if (index[i].length > 1) {
        for (let j = 0; j < index[i].length; j++) {
          record[station].push(line[i] + index[i][j]);
        }
      } else {
        record[station].push(line[i] + index[i]);
      }
    }
  }
  return record;
}

function revertCode(code, data) {
  let codes = getStationCodes(data);
  for (let station in codes) {
    if (codes[station].indexOf(code) > -1) {
      return station;
    }
  }
  for (let station in codes) {
    if (codes[station].includes(code.slice(0, 3))) {
      return station;
    }
  }
  return code + " does not exist";
}

function createNodeConnections(record, lineIndices, data) {
  for (let station in record) {
    let lines = Object.keys(data[station]);
    let indexVal = Object.values(data[station]);
    for (let count in lines) {
      let line = lines[count];
      let index = indexVal[count];
      if (index.length === undefined) {
        index = [index];
      }
      for (let i of index) {
        let indexLocation = lineIndices[line].indexOf(i);
        if (lineIndices[line][indexLocation - 1] !== undefined) {
          let stationName = revertCode(
            line + lineIndices[line][indexLocation - 1],
            data
          );
          record[station].push(stationName);
        }
        if (lineIndices[line][indexLocation + 1] !== undefined) {
          let stationName = revertCode(
            line + lineIndices[line][indexLocation + 1],
            data
          );
          record[station].push(stationName);
        }
      }
    }
  }
}

function getGraph(data) {
  let record = {};
  for (let station in data) {
    record[station] = [];
  }
  let lineIndices = sortLines(data);
  createNodeConnections(record, lineIndices, data);
  return record;
}

function updatePath(station, path) {
  let updatedPath = {};
  let count = 0;
  let currentPaths = Object.values(path);
  for (let i = 0; i < currentPaths.length; i++) {
    let nextNode = station[currentPaths[i][0]].filter(
      station => currentPaths[i].indexOf(station) === -1
    );
    for (let j = 0; j < nextNode.length; j++) {
      updatedPath[count] = [nextNode[j], ...currentPaths[i]];
      count++;
    }
  }
  return updatedPath;
}

function route(start, end, data) {
  let path = {};
  let hit = [[end, start]];
  let stepsPassedHit = 0;
  let filter = filterStations(start, end, data);
  let station = getGraph(filter);
  if (station[start] && station[end]) {
    path[0] = [start];
    while (hit.length < 5 && stepsPassedHit < 5) {
      path = updatePath(station, path);
      hit = [
        ...hit,
        ...Object.values(path).filter(array => {
          return array[0] === end;
        })
      ];
      path = Object.values(path).filter(array => array[0] !== end);
      if (hit.length > 1) {
        stepsPassedHit++;
      }
    }
  } else {
    return station[start] ? end : start + ` station does not exist`;
  }
  return hit;
}

export function getRoute(start, end, data) {
  if (start === "" || end === "") {
    return;
  } else {
    let routeOptions = route(start, end, data);
    let routeCost = [];
    let transferRoute = [];
    for (let i = 0; i < routeOptions.length; i++) {
      if (evaluateRoute(routeOptions[i], data)) {
        routeCost.push(evaluateRoute(routeOptions[i], data)[0]);
        let travelRoute = [];
        let stops = evaluateRoute(routeOptions[i], data)[1];
        for (let j = 0; j < stops.length; j++) {
          if (j === 0) {
            travelRoute.push(stops[j]);
          }
          if (
            stops[j + 1] !== undefined &&
            stops[j].slice(0, 2) !== stops[j + 1].slice(0, 2)
          ) {
            travelRoute.push(stops[j]);
          }
        }
        travelRoute.push(stops[stops.length - 1]);
        transferRoute.push(travelRoute);
      }
    }
    let result = selectTwo(routeCost, transferRoute);
    let toPrint = [];
    for (let count of result) {
      if (
        count !== 0 &&
        transferRoute[count].length === transferRoute[0].length
      ) {
        let directions = [];
        for (let i = 0; i < transferRoute[count].length; i++) {
          if (transferRoute[count][i] !== transferRoute[0][i]) {
            let directions = processRoute(transferRoute[count], data);
            toPrint.push(directions);
            i = transferRoute[count].length;
          }
        }
        if (directions.length > 0) {
          toPrint.push(directions);
        }
      } else {
        let directions = processRoute(transferRoute[count], data);
        toPrint.push(directions);
      }
    }
    return toPrint;
  }
}

function processRoute(route, data) {
  let directions = [],
    guide;
  for (let i = 1; i < route.length; i = i + 1) {
    guide = `${revertCode(route[i - 1], data)} to ${revertCode(
      route[i],
      data
    )}`;
    directions.push(route[i].slice(0, 2));
    directions.push(guide);
  }
  return directions;
}

function selectTwo(routeCost, transferRoute) {
  if (routeCost.length < 3) {
    if (routeCost.length === 1) {
      return [0];
    }
    if (routeCost.length === 2) {
      return routeCost[0] < routeCost[1] ? [0, 1] : [1, 0];
    }
  } else {
    let sortCost = [...routeCost];
    sortCost.sort((a, b) => a - b);
    let loc1 = routeCost.indexOf(sortCost[0], 1);
    if (loc1 === -1) {
      loc1 = routeCost.indexOf(sortCost[1], 1);
    }
    let transferCost = transferRoute.map(a => a.length);
    let loc2 = transferCost.indexOf(
      Math.min(...transferRoute.map(a => a.length))
    );
    if (arrays_equal(transferRoute[0], transferRoute[loc1])) {
      if (arrays_equal(transferRoute[0], transferRoute[loc2])) {
        return [0];
      } else {
        return [0, loc2];
      }
    } else {
      if (
        arrays_equal(transferRoute[0], transferRoute[loc2]) ||
        arrays_equal(transferRoute[loc1], transferRoute[loc2])
      ) {
        return [0, loc1];
      } else {
        return [0, loc1, loc2];
      }
    }
  }
}

function checkLine(start, end) {
  let sameLine = start[0].filter(elem => end[0].indexOf(elem) > -1);
  if (sameLine === undefined || sameLine.length === 0) {
    return false;
  } else {
    return sameLine; //can be more than 1 lines returned (e.g. NS/EW for JE to Cityhall)
  }
}

function lineCost(start, end, lineArr, lineIndices) {
  let route = [];
  for (let i = 0; i < lineArr.length; i++) {
    let cost = [];
    let line = lineArr[i];
    let start_i = start[0].indexOf(line);
    let end_i = end[0].indexOf(line);
    let stops = Math.abs(
      lineIndices[line].indexOf(start[1][start_i]) -
        lineIndices[line].indexOf(end[1][end_i])
    );
    cost.push(stops, line + start[1][start_i], line + end[1][end_i]);
    route.push(cost);
  }
  return route;
}

function stationInfo(data, station) {
  let line = Object.keys(data[station]);
  let index = Object.values(data[station]);
  return [line, index];
}

function evaluateRoute(routeArr, data) {
  let cost = 0;
  let transfer = [];
  let lineIndices = sortLines(data);
  for (let i = routeArr.length - 1; i > 0; i--) {
    let start = stationInfo(data, routeArr[i]);
    let next = stationInfo(data, routeArr[i - 1]);
    let stationLine = checkLine(start, next);
    if (stationLine) {
      let stationCost = lineCost(start, next, stationLine, lineIndices);
      if (stationCost.length === 1) {
        cost = cost + stationCost[0][0];
        if (transfer.length === 0) {
          transfer.push(stationCost[0][1]);
        }
        transfer.push(stationCost[0][2]);
      } else {
        if (transfer.length === 0) {
          transfer.push(stationCost[0][1]);
        } else {
          let line = transfer[transfer.length - 1].slice(0, 2);
          let line1 = stationCost[0][2].slice(0, 2);
          cost = cost + stationCost[0][0];
          if (line === line1) {
            transfer.push(stationCost[0][2]);
          } else {
            transfer.push(stationCost[1][2]);
          }
        }
      }
    } else {
      return false;
    }
  }
  return [cost, transfer];
}

function arrays_equal(a, b) {
  return !!a && !!b && !(a < b || b < a);
}
