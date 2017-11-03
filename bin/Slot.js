const Pad = require("./Pad");

function Slot({ port, name, row }) {
  this.name = name;
  this.port = port;
  this.row = row;
  this.pads = Array(8).fill(null);
  return this;
}

Slot.prototype.setState = function( state = [] ) {
  const _state = [].concat(state).slice(0, 7);
  // if number of project builds changes, create new pads (up to 8) or remove orphaned pads
  //   on first run this will create all new pads
  for (let p = 0; p < 8; p++) {
    // a state with no pad
    if (_state[p] && !this.pads[p]) this.pads[p] = new Pad({ port: this.port, row: this.row, col: p });
    // no state for a pad
    else if (!_state[p] && this.pads[p]) this.pads[p] = null;
    // a state and a pad
    // NOOP
  }

  _state.forEach((val, index) => {
    return this.pads[index].setState( val.status );
  });

};

module.exports = Slot;

/*
SLOT
---
port
name
row
pads
---
setState

*/
