
# TeamCity Build/Deploy Monitor for Novation Launchpad

Monitors statuses of up to 8 build configurations on up to 8 projects.
Set the root project in `config/config.js#/projectLocator`.
Set the projects to monitor in `config/config.js#/subProjects` array.

The service will initialize the MIDI controller first, then it will hit the TeamCity Guest API every 10 seconds and get a fresh list of the last build for each configuration in the root project.  Anything beyond the first 8 build configurations for a project will just be truncated.

Each row of the Launchpad corresponds to one project. (order of projects is as described by `config/config.js#/subProjects`)
Each of the 8 pads in that row represent one build configuration. (order of builds is as output by TeamCity)

GREEN - successful build or deploy
ORANGE - build in progress (UNTESTED)
RED - failed build

Currently, no other buttons besides the 64 pads are active.

### Running

1. Install a Novation USB driver that is compatible with the original "Launchpad" MIDI controller.
2. run `npm install`
3. run `node bin/index.js` to start the service.

### Things to hack on:

- press the pad to log info on a failed build
  - bonus: open the build in a web page
- test that build in progress actually works???
- pressing a play button tells you which project that lane is showing
  - bonus: it tells you the project using text-to-speech
- make this run on a rasp. pi
