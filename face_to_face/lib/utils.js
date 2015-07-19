

getRandImage = function(searchcriteria){
  rand = Math.random();

  var randgt = { random : { $gte : rand } };
  var randlt = {  random : { $lte : rand } };
  if(typeof searchcriteria !== "undefined"){
    jQuery.extend(randgt, searchcriteria);
    jQuery.extend(randlt, searchcriteria);
  }
  result = face_images.findOne( randgt ,{sort : {random : 1}});
  if ( result == null ) {
    result = face_images.findOne( randlt ,{sort : {random : -1}});  
  }
  console.log("got result" + rand);
  console.log(result);
  return result;
};


getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

convertProxyImage = function(imagename, width){
//  var proxyurl = "http://localhost/image_proxy/?action=imgproxy&imgname="+imagename+"&width="+width;
  var proxyurl = "/image_proxy/"+imagename+"&width="+width;
  return proxyurl;

}