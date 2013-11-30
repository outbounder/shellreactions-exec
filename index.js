var exec = require("child_process").exec
var format = require("string-template")
var _ = require("underscore")

/*
  * Input 'c' : Object
    * cmd: String
    * cmdData: Object
    * cmdOptions: Object
    * verbose: Boolean
    * waitForExit: Boolean

  * Input 'next' : function(err, result)
    * err: Error || null
    * result: String || ChildProcess
*/
module.exports = function(c, next){
  if(Array.isArray(c.cmd))
    c.cmd = c.cmd.join(" && ")
  c.cmd = format(c.cmd, c.cmdData)
  
  if(c.dontExecute)
    return next(null, false)

  var childProcess = exec(c.cmd, c.cmdOptions)

  if(c.output) {
    childProcess.stdout.pipe(c.output)
    childProcess.stderr.pipe(c.output)
  }

  if(c.input) {
    c.input.pipe(childProcess.stdin)
    childProcess.on("close", function(code){
      c.input.unpipe(childProcess.stdin)
    })
  }

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
      if(c.report)
        c.report(childProcess, code, buffer)
      next(code != 0?new Error(buffer):null, buffer)
    })
  } else
    next(null, childProcess)
}

module.exports.exec = function(cmd, cmdData, next) {
  var c = {
    cmd: cmd,
    waitForExit: true
  }
  if(cmdData && next) {
    if(cmdData.cmdData)
      _.extend(c, cmdData)
    else
      c.cmdData = cmdData
    module.exports(c, next)
  } else {
    return function(input, next) {
      module.exports(_.extend({}, c, input), next)
    }
  }
}

module.exports.start = function(cmd, cmdData, next) {
  var c = {
    cmd: cmd
  }
  if(cmdData && next) {
    if(cmdData.cmdData)
      _.extend(c, cmdData)
    else
      c.cmdData = cmdData
    module.exports(c, next)
  } else {
    return function(input, next) {
      module.exports(_.extend({}, c, input), next)
    }
  }
}


module.exports.ssh_exec = function(remote, cmd, cmdData, next) {
  if(Array.isArray(cmd))
    cmd = cmd.join(" && ")
  return module.exports.exec("ssh {"+remote+"} '"+cmd+"'", cmdData, next)
}

module.exports.ssh_start = function(remote, cmd, cmdData, next) {
  if(Array.isArray(cmd))
    cmd = cmd.join(" && ")
  return module.exports.start("ssh {"+remote+"} '"+cmd+"'", cmdData, next)
}