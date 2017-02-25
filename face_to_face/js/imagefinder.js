  var maxPage = 90;
  var maxPageVA = 900;
  var searchTerm = "portrait";



if (Meteor.isClient) {

    console.log("in image finder");
    Meteor.subscribe("publication"); // this is so we can listen to the images

    var currentImage;
    var currentObject;


    Template.imagefinder.helpers({
        face_images : function () {
          var result = getRandImage();
          console.log(result);
          return [result];
        },

        hideCompleted: function () {
          return Session.get("hideCompleted");
        },

        getPublishedCount : function(){
          return  Counts.get("images_counter");
        },
        getFaceCount : function(){
          return  Counts.get("face_counter");
        },
        getFaceCheckCount : function(){
          return  Counts.get("faces_checked_counter");
        }

    });


}


if (Meteor.isServer) {
  console.log("in imagefinder server");
  // in this section, we'll get images with faces
  Meteor.startup(function () {
    // code to run on server at startup
    function setRandom() { 
      face_images.find().forEach(function (obj) {
//        console.log(obj);
        face_images.update(obj._id, {$set: {random : Math.random()}});
      }); 
    }
//    setRandom(); 
  });


  Meteor.publish('publication', function() {
    Counts.publish(this, 'face_counter', face_images.find({faces_found : {$exists : true, $eq : true}}));
    Counts.publish(this, 'images_counter', face_images.find());
    Counts.publish(this, 'faces_checked_counter', face_images.find({faces_checked : {$exists : true, $eq : true}}));
//    Counts.publish(this, 'face_counter', face_images.find({faces_found : {$exists : true, $eq : true}}));
  });

  Meteor.publish('face_images_ready', function(){
      return face_images.find({});
  });  

  //face_images.remove({});


  // uncomment below to start finding images
 // findMoreImages();

  function findMoreImages(){
    // start scrapi loop
//    var searchUrl = "http://www.scrapi.org/search/"+searchTerm+"?page="+getRandomInt(0, maxPage);
 //   var searchUrl = "http://www.vam.ac.uk/api/json/museumobject/?q="+searchTerm+"&images=1&limit=20&offset="+getRandomInt(0,maxPageVA);
  // var searchUrl = "http://www.vam.ac.uk/api/json/museumobject/?q="+searchTerm+"&images=1&limit=20&offset="+getRandomInt(0,maxPageVA);
   var searchUrl =  "http://collection.sciencemuseum.org.uk/search?q=motherboard&filter%5Bhas_image%5D=true&page%5Bsize%5D=500&page%5Btype%5D=search";
 //   var searchUrl =  "http://collection.sciencemuseum.org.uk/search?q=Charles";
    console.log("calling " + searchUrl);

    var options = {
      "headers" : {
        "Content-type": "application/json",
        "Accept": "application/json" 
      }  
    };

    // server async
    Meteor.http.get(searchUrl, options, function (err, result) {

      if(err){
        console.log("error! " + err);
        console.log(err);
       // console.log(result);
        return;
      }

      console.log("got data");
      console.log(result);
      console.log("that was the data");

      console.log(result.content);
      console.log("but...");
      var content = JSON.parse(result.content);
//      items = result.data.collection.items; // SCRAPI
      console.log(content);
      console.log("or that was?");
      items = content.data; // Science Musuem
      if(items.length == 0){
        maxPage--;
        if(maxPage <=1){
          maxPage = 1;
        }
        console.log("some sort of problem");
        setTimeout(findMoreImages, 10000);
        return;
      }
      for(i = 0; i < items.length; i++){
        item = items[i];
        console.log(item);
        //var thumb = item.image_thumb; //scrapi

        console.log(item.attributes.multimedia);
        var thumb =   "";// VA

        var image_id = item.attributes.multimedia[0].processed.large.location; //VA
        console.log(image_id);
        var img_prefix = "http://smgco-images.s3.amazonaws.com/media/";

//        console.log(item.attribute.multimedia);
//        var img_id = item.


        console.log(image_id);
        console.log(img_prefix);

        var imageUrl = img_prefix+image_id; // VA
        thumb = imageUrl; // VA

//        var imageUrl = "?action=imgproxy&width=800&imgname="+  thumb.replace(/web-thumb/,"original").replace(/web-large/,"original");
//        var imageUrl = thumb.replace(/web-thumb/,"original").replace(/web-large/,"original"); // scrapi
//        item._id = item.id + ""; // SCRAPI
        item._id = image_id + "_SML"; // VA

        item.imageUrl = imageUrl;
        item.image_large = imageUrl;
        item.image_original = imageUrl;
        item.random = Math.random();
        console.log(item);
        console.log("+++++ inserting " + i);
        try{
          face_images.insert(item); // don't do update, only insert if it doesn't exist
        }catch(Exc){
          console.log("didn't insert");
          console.log(Exc);
        }
      }
      setTimeout(findMoreImages, 60000);
    });

  }
}
