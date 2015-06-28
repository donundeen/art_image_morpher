//face_images = new Mongo.Collection("face_images"); // images with (maybe) face data, and other relevant information


/* need loops for
  - getting images from SCRAPI, and saving them
  - detecting faces in images
  - executing morphs on images with faces data
*/

// util functions


if (Meteor.isClient) {
  // counter starts at 0


  Meteor.startup(function(){
    Session.set('data_loaded', false); 

  });

  Meteor.subscribe("publication"); // this is so we can listen to the images
  Meteor.subscribe('face_images_ready', function(){
    console.log("data is ready");
     //Set the reactive session as true to indicate that the data have been loaded
     Session.set('data_loaded', true); 
  });


  Template.body.helpers({
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


//  var twoItems = face_images.find({}, {sort: , limit: 2});









}





if (Meteor.isServer) {
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

//  face_images.remove({});

  var maxPage = 90;
  var searchTerm = "portrait";
  function findMoreImages(){
    // start scrapi loop
    var searchUrl = "http://www.scrapi.org/search/"+searchTerm+"?page="+getRandomInt(0, maxPage);
    console.log("calling " + searchUrl);

    // server async
    Meteor.http.get(searchUrl, function (err, result) {

      if(err){
        console.log("error! " + err);
        return;
      }

      console.log(result.statusCode, result.data);
      items = result.data.collection.items;
      if(items.length == 0){
        maxPage--;
        if(maxPage <=1){
          maxPage = 1;
        }
        setTimeout(findMoreImages, 10000);
        return;
      }
      for(i = 0; i < items.length; i++){
        item = items[i];
        var thumb = item.image_thumb;
//        var imageUrl = "?action=imgproxy&width=800&imgname="+  thumb.replace(/web-thumb/,"original").replace(/web-large/,"original");
        var imageUrl = thumb.replace(/web-thumb/,"original").replace(/web-large/,"original");
        item._id = item.id + "";
        item.imageUrl = imageUrl;
        item.image_large = thumb.replace(/web-thumb/,"web-large");
        item.image_original = thumb.replace(/web-thumb/,"original");
        item.random = Math.random();
        console.log(item);
        face_images.upsert(item._id, item);
      }
      setTimeout(findMoreImages, 120000);
    });

  }

//  findMoreImages();

}
