const request = require("request");
const h = require("highland");
const config = require("../config/config.js");
const TeamCity = require("../lib/TeamCity");
const MidiAccess = require("../lib/MidiAccess");
const Slot = require("../lib/Launchpad/Slot");

const teamCity = new TeamCity( config );
const midiAccess = new MidiAccess();

midiAccess.initialize()
  .flatMap( port => {

    return teamCity.getProjectStats( 10000 )
      .batchWithTimeOrCount( 1000 )
      .flatMap( batch => h(batch) // each value is a build object
        .group("name") // single value is grouped object
        .through( stream => {

          const slots = Array(8).fill(1).map((v, i) => new Slot({port: port, row: i, name: ""}));

          const pickInOrder = obj => h(config.subProjects)
            .map( subProject => obj[subProject] )

          return stream
            .flatMap( pickInOrder )
            .collect() // single value is an array of array of builds
            .map(projects => projects.forEach((project, index) => slots[index].setState( project )))
        }))
  })
  .errors(err => console.log("error", err))
  .done( () => {})
