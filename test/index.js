global.assert = require("assert");
global.sinon = require("sinon");
global.path = require("path");

// requires a project module by passing a path array relative to the project root
global.getProjectModule = pathsArr => require(path.resolve.apply(null, [__dirname, ".."].concat(pathsArr)));

require("./lib");

