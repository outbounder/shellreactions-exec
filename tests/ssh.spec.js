describe("shellreactions-exec ssh", function(){
  var ssh_exec = require("../index").ssh_exec
  var ssh_start = require("../index").ssh_start

  it("ssh_exec executes directly and returns output on exit", function(next){
    ssh_exec("remote", "echo {value}",{
      remote: "node@176.58.101.229",
      value: "test"
    }, function(err, output){
      expect(err).toBe(null)
      expect(output).toBe("test\n")
      next()
    })
  })
  it("ssh_start and returns childprocess", function(next){
    ssh_start("remote", "echo {value}",{
      remote: "node@176.58.101.229",
      value: "test"
    }, function(err, child){
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
  it("ssh_exec returns reaction", function(next){
    var r = ssh_exec("remote", "echo {value}")
    r({
      cmdData:{
        remote: "node@176.58.101.229",
        value: "test"
      }
    }, function(err, output){
      expect(err).toBe(null)
      expect(output).toBe("test\n")
      next()
    })
  })
  it("ssh_start returns reaction", function(next){
    var r = ssh_start("remote", "echo {value}")
    r({
      cmdData:{
        remote: "node@176.58.101.229",
        value: "test"
      }
    }, function(err, child){
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