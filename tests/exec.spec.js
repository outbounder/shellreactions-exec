describe("shellreactions-exec exec", function(){
  var exec = require("../index").exec
  it("executes directly and returns output on exit", function(next){
    exec("echo test",{}, function(err, output){
      expect(err).toBe(null)
      expect(output).toBe("test\n")
      exec("echo {value}",{value: "test"}, function(err, output){
        expect(err).toBe(null)
        expect(output).toBe("test\n")
        next()
      })
    })
  })
  it("returns reaction which executes and returns output on exit", function(next){
    var r = exec("echo {value}")
    r({cmdData:{value: "test"}}, function(err, output){
      expect(err).toBe(null)
      expect(output).toBe("test\n")
      next()
    })
  })
})