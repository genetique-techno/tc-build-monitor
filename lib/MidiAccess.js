const midiApi = require("web-midi-api");
const h = require("highland");
const helpers = require("./Launchpad/helpers");

function MidiAccess() {

}

MidiAccess.prototype.initialize = function() {

  return h( midiApi.requestMIDIAccess() )
    // kick off a new stream of the midi.outputs iterable
    .flatMap( midi => h( midi.outputs ) )
    // each value coming out of the iterator is an array where the second element is the connection to the midi device
    .sequence()
    .findWhere({name:"Launchpad"})
    .tap( m => {
      m.open();
      helpers.clearAll(m);
    })
};

module.exports = MidiAccess;

/*

  MidiOutput.send( sequence<octet> )
    This is raw bytes being sent down to the controller.  Each octect in the sequence is a byte of data
    You can also send decimal numbers instead of octets because nobody likes a showoff.

  Examples:
    Note On Message: 1001nnnn (midi channel number), 0kkkkkkk (key), 0vvvvvvv (velocity)
      10010000 (channel 1), 01000000 (key 64), 0111111 (vel 127) = 0x90, 0x40, 0x7F
    Note Off Message: 1000nnnn (velocity does not matter on a note off message)
      10000000 (channel 1), 01000000 (key 64), 0111111 (vel 127) = 0x80, 0x40, 0x7F

  Specifics:
    Midi On Channel 1: 144
    Midi Note Off Channel 1: 128
    Launchpad keys:
      0-7 (top row of grid), 8 (row 1 play button)
      16-23 (2nd row), 24 (2nd row play button)
      32
      48
      64
      80
      96
      112

*/
