# shellreactions-exec

child_process.exec wrapper as reaction with additional abilities:

  * replaces placeholders(`{something}`) in commands
  * reaction/continuation style passing

## Api

### reaction function

    var reaction = require("shellreactions-exec")
    reaction(c, next)

Example:

    reaction({
      cmd: "echo test",
      waitForExit: true,
    }, function(err, result){
      // result == "test"
    })

    reaction({
      cmdPattern: "echo {value}",
      cmdData: {
        value: "test"
      },
      waitForExit: true
    }, function(err, result){
      // result == "test"
    })


#### `c` reaction input

    {
      cmd: String,
      cmdPattern: String || Array,
      cmdOptions: Object,
      cmdData: Object,
      verbose: Boolean,
      waitForExit: Boolean
    }

* `cmd` - not needed if `cmdPattern` is used. 
This is the value passed to `chidl_process.exec(value)`

* `cmdPattern` - optional, if set will override `cmd`. 
Any `{placeholder}` will be replaced with the correspnding value from 
the `cmdData` object.

* `cmdOptions` - optional
If set will be directly passed to `child_process.exec(value, options)`

* `verbose` - optional
Will `console.info` the `cmd` value before executing.

* `waitForExit` - optional
When set will wait the childProcess to close. 
The result of the reaction will be the combined stderr and stdout of 
the closed child process. If the child process exits with code different 
than `0`, it is assumed as Error.

#### `next` reaction handler form

    function(err, result){
      // err instanceof Error || null
      // result instanceof String || instanceof ChildProcess
    }

### exec helper

    require("shellreactions-exec").exec(cmdPattern [, cmdData, next])

Example:

    var exec = require("shellreactions-exec").exec
    exec("echo test", {}, function(err, result){
      // result == "test"
    })

    exec("echo {value}", {value: "test"}, function(err, result){
      // result == "test"
    })

Executes commands and waits them to finish by aggregating the 
stderr and stdout output.

* `cmdPattern` - String || Array
When array is passed, it is transformed via `.join(" && ")` to a String.
Then `{placeholders}` are replaced with values from `cmdData`

If `cmdData` and `next` are not given, then this helper returns a reaction
function. 

    var function = require("shellreactions-exec").exec("echo {value}")
    function({value: "test"}, function(err, result){ ... })

Calling it will trigger its execution as reaction, where `c` extends 
initial reaction input created from `cmdPattern`. See last example 
for details.

### start helper

    require("shellreaactions-exec").start(cmdPattern [, cmdData, next])

Example:

    var start = require("shellreactions-exec").start
    start("echo test", {}, function(err, child){
      child.on("data", function(){ ... })
      child.on("close", function(code){
        // ...
      })
    })

    start("echo {value}",{value: "test"}, function(){ ... })

Executes commands and returns a ChildProcess as result of `next`. 
This doesn't waits for commands to finish.

This helper has the same behaviour like the the `exec` described above 
in regards to `cmdData` and `next`.

### ssh_exec helper

    require("shellreactions-exec").ssh_exec(remote, cmdPattern [, cmdData, next])

Example:

    var ssh_exec = require("shellreactions-exec").ssh_exec
    ssh_exec("remote", "echo test", {remote: "user@server"}, function(err, result){
      // result == "test", from user@server via ssh
    })

    ssh_exec("target", "echo {value}", {target: "user@server", value:"test"}, function(err, result){
      // result == "test", from user@server via ssh
    })

Executes commands to `cmdData[remote]` and waits for them to exit. 
This is wrapper of `exec` helper, however it executes all the commands via `ssh`.

* `remote` - String
The passed value will be used to get from `cmdData` the corresponding remote server

The helper generates a single command in form:

    ssh {remote} '{commands}'

### ssh_start helper

    require("shellreactions-exec").ssh_start(remote, cmdPattern [, cmdData, next])

Example:

    var ssh_start = require("shellreactions-exec").ssh_start
    ssh_start("remote", "echo test", {remote: "user@server"}, function(err, child){
      child.on("data", ... )
      child.on("close", ... )
    })

Executes commands to `cmdData[remote]` and returns wrapper ChildProcess.
This is similar to `ssh_exec` helper, but doesn't waits for exit.

## example

    var ssh = require("shellreactions-exec").ssh
    var async = require("async")
    var servers = [
      {
        cmdData: {
          remote: "user@server1",
          cwd: "~/app"  
        }
      },
      {
        cmdData: {
          remote: "user@server2",
          cwd: "~/app"  
        }
      }
    ]
    var updateAndRestart = ssh("remote",[
      "cd {cwd}",
      "git pull",
      "service restart app.js"
    ])

    async.each(servers, updateAndRestart, function(err){
      console.log(err || "done")
    })

# Depends and thanks to

## underscore 
http://underscorejs.org

## string-template 
https://github.com/Matt-Esch/string-template

## jasmine-node
https://github.com/mhevery/jasmine-node