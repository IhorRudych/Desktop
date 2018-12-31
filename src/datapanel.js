var fs = require('fs');
 
var path2 = "./src/Data";
 
fs.readdir(path2, function(err, items) {
    document.getElementById("display-files").innerHTML = items;
});