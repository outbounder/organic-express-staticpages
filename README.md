# organic-express-staticpages

Organelle for mounting and rendering each of expressjs views/templates within directory recursively.

## dna

    {
      "source": "node_modules/organic-express-staticpages",
      "reactOn": "ExpressServer",
      "pattern": "/**/*.jade",
      "path": "path/relative/to/cwd/pages",
      "exclude": undefined,
      "log": false,
      "emitReady": undefined
    }

### `reactOn` property

Should be either `ExpressServer` chemical with [expected structure](https://github.com/outbounder/organic-express-server#emitready-chemical) or array of chemicals where the first one is mapped as `ExpressServer` chemical.


### `path` property

Directory which will be 'glob'-ed with `pattern` and each file will be mounted as get handler having this form:

    app.get("path/to/page", function(req, res){
      res.render("path/to/page")
    })

### `exclude` property

Every file having `exclude` contents in its path will be ignored and not mounted

### `emitReady` property

Once all pages are mounted and if value is present will be emitted as type of chemical

## example usage

Given directory tree

    /-context/pages
     |- index.jade
     |- about.jade
     |- examples
      |- index.jade
      |- example1.jade
      |- example2.jade

Requests to the server render static context/pages templates:

* GET / -> /context/pages/index.jade
* GET /about -> /context/pages/about.jade
* GET /examples -> /context/pages/examples/index.jade
* GET /examples/example1.jade -> /context/pages/examples/example1.jade
* GET /examples/example2.jade -> /context/pages/examples/example2.jade


using expressjs app setup

    var jade = require("jade")
    var express = require("express")

    var app = express()
    app.set("views", path.join(process.cwd(), "context/pages"))
    app.set("view engine", "jade")
    app.engine('jade', jade.__express);

    // ...

    var plasma = new (require("organic-plasma"))()
    require("organic-express-staticpages")(plasma, {
      "reactOn": "ExpressServer",
      "path": "context/pages",
      "log": true
    })
    plasma.emit({type: "ExpressServer", data: app})

    // ...