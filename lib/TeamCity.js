const h = require("highland");
const request = require("request");
const EventEmitter = require("events");

function TeamCity(config) {
  this.subProjects = config.subProjects;
  this.options = {
    url: `${config.teamCityConnection.host}:${config.teamCityConnection.port}/guestAuth/app/rest/buildTypes`,
    qs: {
      locator: `affectedProject:(id:${config.projectLocator})`,
      fields: `buildType(id,parentProjectId,webUrl,builds($locator(count:1,defaultFilter:false),build))`,
    },
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };
}

TeamCity.prototype.getProjectStats = function(timeout) {

  const responseEmitter = new EventEmitter();
  const responseStream = h([h("response", responseEmitter), h("error", responseEmitter)]).merge().flatten();

  function doFetch() {
    request(this.options, (err, res) => {

      if (!err && res.statusCode === 200) {
        setTimeout(doFetch.bind(this), timeout);
        return responseEmitter.emit("response", res);
      }
      return responseEmitter.emit("error", new Error(err || `${res.statusCode} ${res.statusMessage}`));
    });
  };

  // initiate the first fetch, forcing context
  doFetch.call(this);

  return responseStream
    .tap(x => console.log("TeamCity State Fetched"))
    .map( res => JSON.parse(res.body) )
    .map( body => body.buildType )
    .sequence()
    .map( build => {
      build.name = build.id.replace("TP_OneTwoSee_Data_", "").split("_")[0];
      const status = build.builds.build[0].status;
      const state = build.builds.build[0].state;
      build.status = state === "running" ? "BUILDING" : status;
      return build;
    })
    .filter( build => this.subProjects.includes( build.name ) )
    .reject( build => typeof build.status === "undefined" )
};

module.exports = TeamCity;
