const request = require("request");
const h = require("highland");
const config = require("../config/config.js");
const subProjects = config.subProjects.map(suffix => `${config.projectLocator}_${suffix}`);

let sessionID;

const options = {
  url: `${config.teamCityConnection.host}:${config.teamCityConnection.port}/httpAuth/app/rest/buildTypes`,
  qs: {
    locator: `affectedProject:(id:${config.projectLocator})`,
    fields: `buildType(id,webUrl,builds($locator(count:1),build(status)))`,
  },
  method: "GET",
  auth: {
    user: config.user,
    password: config.password,
  },
  headers: {
    Accept: "application/json",
  },
};

h.wrapCallback(request)(options)
  // get the cookie out of the response headers "Set-Cookie" key
  .map( res => res.body )
  .map( JSON.parse )
  .map( body => body.buildType )
  .sequence()
  .map( build => {
    const status = (build.builds.build[0] || {}).status;
    return {
      id: build.id,
      url: build.webUrl,
      status: status,
    };
  })
  .filter( build => subProjects.includes( build.id ) )
  .reject( build => typeof build.status === "undefined" )
  .tap(h.log)
  .done( () => {})
