describe("shellreactions-exec start", function(){
  var start = require("../index").start
  it("executes directly and returns child", function(next){
    start("echo test",{}, function(err, child){
      expect(err).toBe(null)
      child.on("data", function(chunk){
        expect(chunk).toBe("test")
      })
      child.on("close", function(code){
        expect(code).toBe(0)
        next()
      })
    })
  })
  it("returns reaction which executes and returns child", function(next){
    var r = start("echo {value}")
    r({cmdData:{value: "test"}}, function(err, child){
      expect(err).toBe(null)
      child.on("data", function(chunk){
        expect(chunk).toBe("test")
      })
      child.on("close", function(code){
        expect(code).toBe(0)
        next()
      })
    })
  })
})