var url = "http://134.213.70.206/bos/view.php?q=0&limit=50&json=true";
var scale = 1.75;
var shiftx = 50;
var shifty = 50;
var width=608;
var height= 800;
var imageIndex = 0;
var ctx = false;
var canvas = false;
var faces = false;


function showFace(face, scale){
  $(".indexShow").text(imageIndex);
 var imageurl = face.largeMediaLocation;
  var image = new Image();
  $(".jsonview").JSONView(face);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  image.onload = function () {
    var width = parseInt(image.width) * scale;
    var height = parseInt(image.height) * scale;
    ctx.drawImage(image, 0, 0, width, height);
    annotateFace(face,ctx);
    
  };
  image.src= imageurl;
  
  //ctx.drawImage(image,0,0);
  function annotateFace(face, ctx){
  var facedata = face.visionResponse.responses[0].faceAnnotations[0];
  
  ctx.strokeStyle="#FF0000";
    ctx.moveTo(facedata.boundingPoly.vertices[0].x,facedata.boundingPoly.vertices[0].y);  ctx.lineTo(facedata.boundingPoly.vertices[1].x,facedata.boundingPoly.vertices[1].y);
ctx.lineTo(facedata.boundingPoly.vertices[2].x,facedata.boundingPoly.vertices[2].y);
ctx.lineTo(facedata.boundingPoly.vertices[3].x,facedata.boundingPoly.vertices[3].y);
ctx.lineTo(facedata.boundingPoly.vertices[0].x,facedata.boundingPoly.vertices[0].y);
 ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  
  ctx.strokeStyle="#00FF00";
  ctx.moveTo(facedata.fdBoundingPoly.vertices[0].x,facedata.fdBoundingPoly.vertices[0].y);  ctx.lineTo(facedata.fdBoundingPoly.vertices[1].x,facedata.fdBoundingPoly.vertices[1].y);
ctx.lineTo(facedata.fdBoundingPoly.vertices[2].x,facedata.fdBoundingPoly.vertices[2].y);
ctx.lineTo(facedata.fdBoundingPoly.vertices[3].x,facedata.fdBoundingPoly.vertices[3].y);
ctx.lineTo(facedata.fdBoundingPoly.vertices[0].x,facedata.fdBoundingPoly.vertices[0].y);
  ctx.stroke();
  
    ctx.closePath();
  ctx.beginPath();
  ctx.strokeStyle="#88FFFF";
  var landmarks = facedata.landmarks
  
  for(var i=0; i < landmarks.length; i++){
    var landmark = landmarks[i];
    ctx.beginPath();
      ctx.arc(landmark.position.x, landmark.position.y, 5, 0, 2 * Math.PI, false);
    ctx.strokeText(landmark.type, landmark.position.x, landmark.position.y);
    ctx.stroke();
    ctx.closePath();
  }
  } 
  
}


function doTheThings(data){
// everything you want to do should happen inside this function
 // the data var will be populated with whatever you've requested from other widgets
// and this function will be called when all those widgets have complete 
  
   console.log("doing the things");
   console.log(data);
  $(".c5_data").text(JSON.stringify(data));
  faces = data.faces.data;
  var face = data.faces.data[imageIndex];
  canvas = $("<canvas id='facecanvase' width='2000' height='2000'/>")[0];
  ctx = canvas.getContext("2d");
  $(".faceimage").append(canvas);
  
  showFace(face, scale);
  
   // you probably don't need to mess with code below this line.
   c5_done(); // this message is required at the end of all the processing, so the system knows this widget is done 
 } 

requireWidgetData( 
// all requests to other widgets go here (automatically if you use the 'pull from' interface): 
// c5_requires
  [
{
    id : "faces",
    type :"webservice", 
    url : url}
  ] ,
// end_c5_requires 
// end other widget requests 
 doTheThings);