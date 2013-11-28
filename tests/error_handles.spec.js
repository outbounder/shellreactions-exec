describe("when happens", function(){
  var reaction = require("../index")
  var exec = reaction.exec
  var start = reaction.start

  // TBD
  var ssh_exec = reaction.ssh_exec
  var ssh_start = reaction.ssh_start

  describe("not valid command to be executed", function(){
    it("reaction returns error", function(next){
      reaction({
        cmd: "not-valid-command"
      }, function(err){
        expect(err).toBeDefined()
        next()
      })    
    })  

    it("exec returns error", function(next){
      exec("not-valid-command",{},function(err){
        expect(err).toBeDefined()
        next()
      })    
    })

    it("start returns child which returns code different than 0 on close", function(next){
      start("not-valid-command",{},function(err, child){
        expect(err).toBe(null)
        child.on("close", function(code){
          expect(code).not.toBe(0)
          next()
        })
      })
    })
  })

  describe("command to fail execution", function(){
    it("reaction returns error", function(next){
      reaction({
        cmd: "mkdir"
      }, function(err){
        expect(err).toBeDefined()
        next()
      })    
    })  

    it("exec returns error", function(next){
      exec("mkdir",{},function(err){
        expect(err).toBeDefined()
        next()
      })    
    })

    it("start returns child which returns code different than 0 on close", function(next){
      start("mkdir",{},function(err, child){
        expect(err).toBe(null)
        child.on("close", function(code){
          expect(code).not.toBe(0)
          next()
        })
      })    
    })
  })
  
})