var shelljs = require("shelljs")

module.exports = function(commandPatterns){
  if(typeof commandPatterns == "function")
    commandPatterns = commandPatterns()
  if(typeof commandPatterns == "string")
    commandPatterns = [commandPatterns]
  return function(options, next) {
    var cmd = commandPatterns.join(" && ")
    var matched = cmd.match(/\#\{([a-z0-9A-Z]+)\}/g)
    
    if(matched)
      for(var i = 0; i<matched.length; i++) {
        var key = matched[i].replace("#{","").replace("}","")
        cmd = cmd.replace(matched[i], options[key])
      }

    if(options.verbose)
      console.info("shell exec",cmd)
    var childProcess = shelljs.exec(cmd, {async: true, silent: true})
    
    if(options.pipeOutput) {
      childProcess.stdout.pipe(process.stdout)
      childProcess.stderr.pipe(process.stderr)
    }

    if(options.waitForExit) {
      var buffer = ""
      childProcess.on("error", next)
      childProcess.stdout.on("data", function(chunk){
        buffer += chunk.toString()
      })
      childProcess.stderr.on("data", function(chunk){
        buffer += chunk.toString()
      })
      childProcess.on("exit", function(code){
        next(code != 0?new Error(code):null, {
          code: code,
          data: buffer
        })
      })
    } else 
      next(null, childProcess)
  }
}