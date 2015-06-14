// node server for socialDash
/*
- return index.html
- process request for new list(s) from various social media feeds:
-- twitter
-- instagram
-- flickr
-- facebook?
*/


var async = require("async");

var urlparser = require("url");

var fs = require("fs");
var pathparser = require("path");
var http = require("http");

var mysecrets = {port: 9191};


var port = mysecrets.port;
if(process && process.env && process.env.NODE_ENV == "production"){
  port = mysecrets.prod_port;
}

startServer();

var started = false;
function startServer(){

  if(!started){
    started = true;
  }else{
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! already started!");
    return;
  }
    
  var http = require('http');
  http.createServer(function (req, res) {
    parseRequest(req, res);

  }).listen(port);
  console.log('Server running at port ' + port);
}



function parseRequest(req, res){
	var rand = Math.random() * 100;
	if(req.headers["access-control-request-headers"]){
  		res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);        
  	}
  res.setHeader("Access-Control-Allow-Origin", "*");        

  console.log("got request");
  var parsed = urlparser.parse(req.url, true)
  var query = urlparser.parse(req.url, true).query;
  console.log('~~~~~~~~~~~~~~~~~');
 // console.log(parsed);
  console.log('~~~~~~~~~~~~~~~~~');
  //console.log(query);
  console.log('~~~~~~~~~~~~~~~~~');

  if(!query.action){
    sendFile(parsed.pathname, query, res, rand);

  }else if (query.action == "imgproxy"){
    console.log(parsed);
    imgproxy(query.imgname, query.width, query.height, query, res);
  }else{
   res.writeHead(200, {'Content-Type': 'text/html', 
                        'Access-Control-Allow-Origin' : '*'});
   res.end("<html><body><pre>not sure what to do</pre></body></html>");
  }

}


function imgproxy(imgname, width, height, query, res){
  var extname = pathparser.extname(imgname);

  if(typeof width === 'undefined' || !width ){
    width = 500;
  }
  if(typeof height === 'undefined' || !height ){
    height = 500;
  }

  var contentType = 'text/html';
  switch (extname.toLowerCase()) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }

  console.log(imgname);
  var imgname2 = imgname.replace(/^http:\/\//,'');
  var split = imgname2.split(/\//);
  var host = split.shift();
  var path = "/"+split.join("/");

  console.log(host + " ::: " + path);

  var options = {
      host: host,
      path: path
  };

  var gm = require('gm');

/*
  res.writeHead(404, {'Content-Type': contentType, 
                  'Access-Control-Allow-Origin' : '*'});
*/
  console.log("resizing to width "  + width);

/*
  gm("32_100.43.jpg")
  .resize(500, 500)
  .autoOrient()
  .stream(function(err, stdout, stderr){
    stdout.pipe(res);
//    res.end();
  });
*/



  var callback = function(response) {
      if (response.statusCode === 200) {
          res.writeHead(200, {
              'Content-Type': response.headers['content-type'], 
                  'Access-Control-Allow-Origin' : '*'});
var ims=fs.createWriteStream('name.jpeg');


//          response.pipe(res);
          console.log("trying width " + width);
          gm(response)
          .resize(width)
          .autoOrient()
          .stream(function(err, stdout, stderr){
            if(err){
              console.log("error in resizing");
              console.log(err);
              res.end();
            }else{
              console.log("resize ok");
              stdout.pipe(res);
            }
        //    res.end();
          }).write(ims, function(){
            console.log("done");            
          });

      } else {
          console.log("bad responde " + response.statusCode);
          res.writeHead(response.statusCode);
          res.end();
      }
  };

  http.request(options, callback).end();

}

var dataCache = {};
function sendFile(path, query, res){

  if(path == "/"){
    path = "/index.html";
  }
  var extname = pathparser.extname(path);
  var contentType = 'text/html';
  switch (extname.toLowerCase()) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }

  if(!dataCache[path]){
    fs.readFile("."+path, function(err, data){
      if(err){
        console.log("file read error");
        console.log(err);
        res.writeHead(404, {'Content-Type': contentType, 
                        'Access-Control-Allow-Origin' : '*'});
        //indexhtml = data;
        res.end(data);
      }else{
        res.writeHead(200, {'Content-Type': contentType, 
                        'Access-Control-Allow-Origin' : '*'});
        console.log("writing file " + path);
     //   console.log(data);
        //dataCache[path] = data;
        res.end(data);
      }
    });
  }else{
    res.writeHead(200, {'Content-Type': contentType, 
                        'Access-Control-Allow-Origin' : '*'});
    res.end(dataCache[path]);
  }
}
