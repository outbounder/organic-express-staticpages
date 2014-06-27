var path = require("path")
var glob = require("glob-stream")

module.exports = function(plasma, dna) {
  plasma.on(dna.reactOn, function(c){
    var app = c.data || c[0].data;
    var pagesRootPath = path.join(process.cwd(),dna.path.replace(/\//g, path.sep))
    
    // glob for action handlers
    glob.create(path.join(pagesRootPath,dna.pattern))
      .on("data", function(file){
        if(file.path.indexOf(dna.exclude) !== -1)
          return
        
        var url = file.path.split(pagesRootPath).pop()
        url = url.replace(path.extname(file.path), "")
        var sep = path.sep == "\\" ? "\\\\" : path.sep;
        url = url.replace(new RegExp(sep, "g"), "/")
        var templatePath = url.replace("/", "")
        if(url.split("/").pop() == "index")
          url = url.replace("index", "")
        app.get(url, function(req, res, next){
          res.render(templatePath)
        })
        if(dna.log)
          console.log("static page", url,"->",templatePath)
      })
      .on("error", console.error)
      .on("end", function(){
        if(dna.emitReady) plasma.emit(dna.emitReady, true)
      })
  })
}
