var exec = require("child_process").exec
var format = require("string-template")
var _ = require("underscore")

/*
  * Input 'c' : Object
    * cmd: String
    * cmdPattern: String || Array
    * cmdData: Object
    * cmdOptions: Object
    * verbose: Boolean
    * waitForExit: Boolean

  * Input 'next' : function(err, result)
    * err: Error || null
    * result: String || ChildProcess
*/
module.exports = function(c, next){
  if(c.cmdPattern) {
    if(Array.isArray(c.cmdPattern))
      c.cmdPattern = c.cmdPattern.join(" && ")
    c.cmd = format(c.cmdPattern, c.cmdData)
  }

  if(c.verbose)
    console.info("shell exec", c.cmd, c.cmdOptions)
  
  var childProcess = exec(c.cmd, c.cmdOptions)

  if(c.waitForExit) {
    var buffer = ""
    childProcess.on("error", next)
    childProcess.stdout.on("data", function(chunk){
      buffer += chunk.toString()
    })
    childProcess.stderr.on("data", function(chunk){
      buffer += chunk.toString()
    })
    childProcess.on("close", function(code){
      next(code != 0?new Error(buffer):null, buffer)
    })
  } else
    next(null, childProcess)
}

module.exports.exec = function(cmdPattern, cmdData, next) {
  var c = {
    cmdPattern: cmdPattern,
    waitForExit: true
  }
  if(cmdData && next) {
    c.cmdData = cmdData
    module.exports(c, next)
  } else {
    return function(input, next) {
      module.exports(_.extend({}, c, input), next)
    }
  }
}

module.exports.start = function(cmdPattern, cmdData, next) {
  var c = {
    cmdPattern: cmdPattern
  }
  if(cmdData && next) {
    c.cmdData = cmdData
    module.exports(c, next)
  } else {
    return function(input, next) {
      module.exports(_.extend({}, c, input), next)
    }
  }
}


module.exports.ssh_exec = function(remote, cmdPattern, cmdData, next) {
  if(Array.isArray(cmdPattern))
    cmdPattern = cmdPattern.join(" && ")
  return module.exports.exec("ssh {"+remote+"} '"+cmdPattern+"'", cmdData, next)
}

module.exports.ssh_start = function(remote, cmdPattern, cmdData, next) {
  if(Array.isArray(cmdPattern))
    cmdPattern = cmdPattern.join(" && ")
  return module.exports.start("ssh {"+remote+"} '"+cmdPattern+"'", cmdData, next)
}