
describe( "Slot", function() {

  before( function() {
    this.lib = getProjectModule(["lib", "Launchpad", "Slot.js"], {
      "./Pad": sinon.spy(({port, row, col}) => ({
        port,
        row,
        col,
        setState: sinon.spy(),
      })),
    });
  });

  describe( "constructor", function() {

    it( "sets the correct properties on context and returns itself", function() {
      const ctx = {};
      const output = this.lib.call( ctx, { name: "bob", port: {}, row: 13 } );
      assert.equal( ctx.name, "bob", "correct slot name was set" );
      assert.equal( ctx.row, 13, "correct slot row was set" );
      assert( "port" in ctx, "port was set on context" );
      assert( "pads" in ctx, "pads was set on context" );
      assert( ctx.pads instanceof Array, "pads is an array" );
      assert.equal( ctx.pads.length, 8, "correct length of pads" );
      assert.deepEqual( output, ctx, "returned itself" );
    });

  });

  describe( "setState", function() {

    beforeEach( function() {
      this.ctx = {
        pads: Array(8).fill(null),
        row: 1337,
      };
    });

    it( "should create 8 pads and call setState on each one", function() {
      const state = Array(8).fill({ status: "feelin' fine" });
      this.lib.prototype.setState.call( this.ctx, state );
      assert.equal( this.ctx.pads.length, 8, "8 pads created" );
      this.ctx.pads.forEach( pad => sinon.assert.calledOnce( pad.setState ) );
    })

    it( "should create 1 pad if state is just a single object instead of an array", function() {
      const state = { status: "feelin' fine" };
      this.lib.prototype.setState.call( this.ctx, state );
      assert.notEqual( this.ctx.pads[0], null, "pad created in col 1" );
      assert.deepEqual( this.ctx.pads.slice(1, 8), Array(7).fill(null), "all other pads are empty" );
      sinon.assert.calledOnce( this.ctx.pads[0].setState );
    });

    it( "should ignore any state that is longer than 8", function() {
      const state = Array(14).fill({ status: "feelin' fine" });
      this.lib.prototype.setState.call( this.ctx, state );
      assert.equal( this.ctx.pads.length, 8, "only 8 pads created" );
    });

    it( "should remove orphanned pads on state change", function() {
      // initial state
      let state = Array(8).fill({ status: "feelin' fine" });
      this.lib.prototype.setState.call( this.ctx, state );
      this.ctx.pads.forEach( pad => assert.notEqual( pad, null, "column is not null" ) );
      // updated, shorter state
      state = Array(4).fill({ status: "uh oh" });
      this.lib.prototype.setState.call( this.ctx, state );
      this.ctx.pads.slice(0, 4).forEach( pad => assert.notEqual( pad, null, "column is not null" ) );
      this.ctx.pads.slice(4, 8).forEach( pad => assert.equal( pad, null, "column is empty" ) );
    });

    it( "should create new pads on state length change", function() {
      // initial state
      let state = Array(4).fill({ status: "feelin' fine" });
      this.lib.prototype.setState.call( this.ctx, state );
      this.ctx.pads.slice(0, 4).forEach( pad => assert.notEqual( pad, null, "column is not null" ) );
      this.ctx.pads.slice(4, 8).forEach( pad => assert.equal( pad, null, "column is empty" ) );
      // updated, shorter state
      state = Array(8).fill({ status: "uh oh" });
      this.lib.prototype.setState.call( this.ctx, state );
      this.ctx.pads.forEach( pad => assert.notEqual( pad, null, "column is not null" ) );
    });

  });

});
