
describe( "Pad", function() {

  before( function() {
    this.lib = getProjectModule(["lib", "Launchpad", "Pad.js"], {
      "./helpers": mockMidiHelpers,
    });
  });

  describe( "constructor", function() {

    beforeEach( function() {
      this.ctx = {
        _sendMidi: sinon.spy(),
      };
      this.fakeOptions = {
        port: {},
        row: 1,
        col: 2,
      };
    });

    it( "assigns the correct properties to context and sends initial midi state", function() {
      this.lib.call( this.ctx, this.fakeOptions );
      sinon.assert.calledOnce(this.ctx._sendMidi); // sets initial state
      assert.equal( typeof this.ctx.port, "object", "has midi port" );
      assert.equal( typeof this.ctx.key, "number", "midi key was set" );
      assert.equal( this.ctx.state, "off", "initial state of pad is off" );
    });

    afterEach( function() {
      this.ctx._sendMidi.reset();
    });

  });

  describe( "_sendMidi", function() {

    beforeEach( function() {
      this.ctx = {
        port: {
          send: sinon.spy()
        },
        key: 1337,
      };
    });

    it( "SUCCESS", function() {
      this.lib.prototype._sendMidi.call( this.ctx, "SUCCESS" );
      sinon.assert.calledOnce(this.ctx.port.send);
      sinon.assert.calledWith(this.ctx.port.send, sinon.match.typeOf("array"));
      const args = this.ctx.port.send.getCall(0).args[0];
      assert.equal( args[0], 144, "send was called with note on message" );
      assert.equal( args[1], 1337, "send was called with the correct key number" );
      assert.equal( args[2], "SUCCESS", "send was called with the equivalent of SUCCESS" );
    });

    it( "FAILURE", function() {
      this.lib.prototype._sendMidi.call( this.ctx, "FAILURE" );
      sinon.assert.calledOnce(this.ctx.port.send);
      sinon.assert.calledWith(this.ctx.port.send, sinon.match.typeOf("array"));
      const args = this.ctx.port.send.getCall(0).args[0];
      assert.equal( args[0], 144, "send was called with note on message" );
      assert.equal( args[1], 1337, "send was called with the correct key number" );
      assert.equal( args[2], "FAILURE", "send was called with the equivalent of FAILURE" );
    });

    it( "BUILDING", function() {
      this.lib.prototype._sendMidi.call( this.ctx, "BUILDING" );
      sinon.assert.calledOnce(this.ctx.port.send);
      sinon.assert.calledWith(this.ctx.port.send, sinon.match.typeOf("array"));
      const args = this.ctx.port.send.getCall(0).args[0];
      assert.equal( args[0], 144, "send was called with note on message" );
      assert.equal( args[1], 1337, "send was called with the correct key number" );
      assert.equal( args[2], "BUILDING", "send was called with the equivalent of BUILDING" );
    });

    it( "OTHER", function() {
      this.lib.prototype._sendMidi.call( this.ctx, "OTHER" );
      sinon.assert.calledOnce(this.ctx.port.send);
      sinon.assert.calledWith(this.ctx.port.send, sinon.match.typeOf("array"));
      const args = this.ctx.port.send.getCall(0).args[0];
      assert.equal( args[0], 129, "send was called with note off message" );
      assert.equal( args[1], 1337, "send was called with the correct key number" );
      assert.equal( args[2], 0, "send was called with the value 0" );
    });

    afterEach( function() {
      this.ctx.port.send.reset();
    });

  });

  describe( "setState", function() {

    beforeEach( function() {
      this.ctx = {
        _sendMidi: sinon.spy(),
      };
    });

    it( "same state", function() {
      const ctx = r.merge( { state: "old state" }, this.ctx );
      this.lib.prototype.setState.call( ctx, "old state" );
      assert.equal( ctx.state, "old state", "state did not change" );
      sinon.assert.notCalled( ctx._sendMidi );
    });

    it( "new state", function() {
      const ctx = r.merge( { state: "old state" }, this.ctx );
      this.lib.prototype.setState.call( ctx, "new state" );
      assert.equal( ctx.state, "new state", "state was changed" );
      sinon.assert.calledOnce( ctx._sendMidi );
      sinon.assert.calledWith( ctx._sendMidi, "new state" );
    });

    afterEach( function() {
      this.ctx._sendMidi.reset();
    });

  });

});
