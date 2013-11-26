describe("shellreactions-exec", function(){
  var exec = require("../index")

  describe("with string input", function(){
    it("executes echo command", function(next){
      var cmd = exec("echo test")
      cmd({}, function(err, child){
        child.on("close", function(code){
          expect(code).toBe(0)
          next()
        })
      })
    })

    it("executes echo command template", function(next){
      var cmd = exec("echo #{variable}")
      cmd({variable: "test"}, function(err, child){
        child.on("data", function(chunk){
          expect(chunk.toString()).toBe("test")
        })
        child.on("close", function(code){
          expect(code).toBe(0)
          next()
        })
      })
    })

    it("executes echo command template and waits for exit", function(next){
      var cmd = exec("echo #{variable}")
      cmd({variable: "test", waitForExit: true}, function(err, output){
        expect(output.code).toBe(0)
        expect(output.data).toBe("test\n")
        next()
      })
    })  
  })

  describe("with array of strings input", function(){
    it("executes echo commands and waits for exit", function(next){
      var cmd = exec(["echo #{variable1}", "echo #{variable2}"])
      cmd({variable1: "test1", variable2: "test2", waitForExit: true}, function(err, output){
        expect(output.code).toBe(0)
        expect(output.data).toBe("test1\ntest2\n")
        next()
      })
    })
  })

  describe("with function input", function(){
    it("executes the result of function input", function(next){
      var cmd = exec(function(){return "echo test"})
      cmd({waitForExit: true}, function(err, output){
        expect(output.code).toBe(0)
        expect(output.data).toBe("test\n")
        next()
      })
    })
  })
  
})