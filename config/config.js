const secrets = require("./secrets");

module.exports = {
  teamCityConnection: secrets.teamCityConnection,
  projectLocator: "TP_OneTwoSee_Data",
  subProjects: [
    "ApiMultiSport",
    "Parser",
    "DbStore",
    "Aggregator",
    "FilePublisher",
    "DockerStack",
  ],
};
