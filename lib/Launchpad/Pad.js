const midiHelpers = require("./helpers");

function Pad({ port, row, col }) {
  this.port = port;
  this.state = "off";
  this.key = midiHelpers.getKey({ row, col });
  this._sendMidi( this.state );
}

Pad.prototype._sendMidi = function( state ) {
  const p = this.port;
  switch (state) {
    case "SUCCESS":
      p.send([ 144, this.key, midiHelpers.getVelocity("SUCCESS") ]);
      break;
    case "FAILURE":
      p.send([ 144, this.key, midiHelpers.getVelocity("FAILURE") ]);
      break;
    case "BUILDING":
      p.send([ 144, this.key, midiHelpers.getVeloctiy("BUILDING")]);
      break;
    default:  // "off"
      p.send([ 129, this.key, 0 ]);
  }
};

Pad.prototype.setState = function( newState ) {
  if (newState !== this.state) {
    this._sendMidi( newState )
    this.state = newState;
  }
  return this.state;
};

module.exports = Pad;

/*
PAD
---
state
vel
row
col
url
---
_sendMidi
setState
*/
