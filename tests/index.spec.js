describe("shellreactions-exec reaction", function(){
  var reaction = require("../index")

  describe("with cmd", function(){
    it("executes echo command", function(next){
      reaction({cmd: "echo test"}, function(err, child){
        child.on("close", function(code){
          expect(code).toBe(0)
          next()
        })
      })
    })
  })

  describe("with cmdPattern", function(){
    describe("as string", function(){
      it("executes echo command template", function(next){
        reaction({
          cmd: "echo {variable}", 
          cmdData: {variable: "test"}
        }, function(err, child){
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
        reaction({
          cmd: "echo {variable}", 
          cmdData: {variable: "test"},
          waitForExit: true
        }, function(err, result){
          expect(err).toBe(null)
          expect(result).toBe("test\n")
          next()
        })
      }) 
    })

    describe("as array", function(){
      it("executes echo commands and waits for exit", function(next){
        reaction({
          cmd: ["echo {variable1}", "echo {variable2}"],
          cmdData: {variable1: "test1", variable2: "test2"},
          waitForExit: true
        }, function(err, output){
          expect(output).toBe("test1\ntest2\n")
          next()
        })
      })
    })
  })
})