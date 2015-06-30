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


}





