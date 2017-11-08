global.assert = require("assert");
global.sinon = require("sinon");
global.path = require("path");
global.proxyquire = require("proxyquire").noCallThru();
global.r = require("ramda");

// requires a project module by passing a path array relative to the project root
global.getProjectModule = (pathsArr, stubObj) => {
  if (stubObj) return proxyquire(path.resolve.apply(null, [__dirname, ".."].concat(pathsArr)), stubObj)
  else return require(path.resolve.apply(null, [__dirname, ".."].concat(pathsArr)))
};

global.mockMidiHelpers = {
  // clearAll: (port) => mapOverAllPads(port, 0),
  // fullColorMap: fullColorMap,
  // strobeOn: strobeOn,
  // strobeOff: strobeOff,
  getKey: x => 1,
  getVelocity: x => x,
};

require("./lib");
