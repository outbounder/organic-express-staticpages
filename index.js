var path = require("path")
var glob = require("glob-stream")

module.exports = function(plasma, dna) {
  var exclude = function(file){
    if(Array.isArray(dna.exclude)) {
      for(var i = 0; i<dna.exclude.length; i++)
        if(file.path.indexOf(dna.exclude[i]) !== -1)
          return true
      return false
    } else
      return file.path.indexOf(dna.exclude) !== -1
  }
  plasma.on(dna.reactOn, function(c){
    var app = c.data || c[0].data;
    var foundPages = []
    var pagesRootPath = path.join(process.cwd(),dna.path)
    
    // glob for action handlers
    glob.create(path.join(pagesRootPath,dna.pattern))
      .on("data", function(file){
        if(exclude(file)) return
        
        var url = file.path.split(pagesRootPath).pop()
        url = url.replace(path.extname(file.path), "")
        var templatePath = url.replace("/", "")
        if(url.split("/").pop() == "index")
          url = url.replace("index", "")
        app.get(url, function(req, res, next){
          res.render(templatePath)
        })
        if(dna.log)
          console.log("static page", url,"->",templatePath)
        foundPages.push({
          url: url,
          templatePath: templatePath
        })
      })
      .on("error", console.error)
      .on("end", function(){
        if(dna.emitReady) plasma.emit({type: dna.emitReady, data: foundPages})
      })
  })
}