var jade = require("jade")
var express = require("express")
var path = require("path")
var expect = require("chai").expect

describe("index test", function(){

  var app
  var plasma

  beforeEach(function(){
    app = express()
    app.set("views", path.join(process.cwd(), "context/pages"))
    app.set("view engine", "jade")
    app.engine('jade', jade.__express)

    plasma = new (require("organic-plasma"))()

    // construct organelle with dna
    require("../index")(plasma, {
      "emitReady": "done",
      "reactOn": "ExpressServer",
      "path": "test/data",
      "pattern": "**/*.jade"
    })
  })

  it("mounts all test routes", function(){
    plasma.on("done", function(c){
      expect(c.data.length).to.be.equal(3)
    })
    plasma.emit({type: "ExpressServer", data: app})
  })
})