// face-finder code
//face_images = new Mongo.Collection("face_images"); // images with (maybe) face data, and other relevant information



if (Meteor.isClient) {


    Meteor.subscribe("publication"); // this is so we can listen to the images

    var currentImage;
    var currentObject;

    // detect if tracker fails to find a face
    document.addEventListener("clmtrackrNotFound", function(event) {
        ctrack.stop();
        ctrack.reset();
        console.log(" clmtrackrNotFound The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
        console.log("face was " + currentImage);

        // save "no face" data to collection
        currentObject.faces_checked = true;
        currentObject.faces_found = false;
        face_images.upsert(currentObject._id, currentObject);

        setTimeout(function(){
            startFindFaces();
        }, 500);
    }, false);
    
    // detect if tracker loses tracking of face
    document.addEventListener("clmtrackrLost", function(event) {
        ctrack.stop();
        ctrack.reset();
        console.log(" clmtrackrLost The tracking had problems converging on a face in this image. Try selecting the face in the image manually.")
        console.log("face was " + currentImage);

        // save "no face" data to collection

        currentObject.faces_checked = true;
        currentObject.faces_found = false;
        face_images.upsert(currentObject._id, currentObject);


        setTimeout(function(){
            startFindFaces();
        }, 500);

    }, false);
    

    // detect if tracker has converged

    document.addEventListener("clmtrackrConverged", function(event) {

        console.log("found face for " + currentImage);
        // stop drawloop
        //cancelRequestAnimFrame(drawRequest);
        /*
        window.cancelAnimationFrame(drawRequest) ||
                window.webkitCancelRequestAnimationFrame(drawRequest) ||
                window.mozCancelRequestAnimationFrame(drawRequest) ||
                window.oCancelRequestAnimationFrame(drawRequest) ||
                window.msCancelRequestAnimationFrame(drawRequest)||
                window.clearTimeout(drawRequest);
*/

        positions = ctrack.getCurrentPosition();
        console.log(positions);

        ctrack.stop();
        ctrack.reset();

        currentObject.faces_checked = true;
        currentObject.faces_found = true;
        currentObject.face_positions= positions;
        face_images.upsert(currentObject._id, currentObject);

        setTimeout(function(){
            startFindFaces();
        }, 500);

    }, false);



    var db_ready = false;
    var template_ready = false;
    Meteor.subscribe('face_images_ready', function(){
        db_ready = true;
        console.log("data is ready");
        //Set the reactive session as true to indicate that the data have been loaded
        if(db_ready && template_ready){
            console.log("gonna find faces now");
     //       startFindFaces();
        }
    });


    Template.facefinder.rendered = function(){
        console.log("facefinder rendered");
        template_ready = true;
        if(db_ready && template_ready){
            console.log("gonna find faces now");            
    //        startFindFaces();
        }
    }


    function startFindFaces(){

        image = getRandImage({faces_checked : {$exists : false}});
        imagename = image.image_large;
        currentImage = imagename;
        currentObject = image;

        imageurl = convertProxyImage(imagename, 500);

        console.log("finding on "  + imageurl);
        var cc = document.getElementById('image1').getContext('2d');
        if(typeof ctrack !== 'undefined'){
            console.log("resetting");
            ctrack = new clm.tracker({stopOnConvergence : true, useWebGL: true});
            ctrack.stop();
            ctrack.reset();
    //      delete ctrack;
        }else{
            ctrack = new clm.tracker({stopOnConvergence : true, useWebGL: true});
        }
        img = new Image();

    //  ctrack = new clm.tracker({stopOnConvergence : true});
        img.onload = function() {

            // save image width data

            cc.canvas.width = this.width;
            cc.canvas.height = this.height;

            currentObject.width = this.width;
            currentObject.height = this.height;

            cc.drawImage(img,0,0,this.width, this.height);
            ctrack.init(pModel);            
//          ctrack.start(document.getElementById('image1'));
            ctrack.start(document.getElementById('image1'));
        };
        img.onerror = function(){
            console.log("error getting image");
            // save error status
            ctrack.stop();
            ctrack.reset();

            setTimeout(function(){
                startFindFaces();
            }, 500);
            return;         
        }
        img.src = imageurl;

    }

   // startFindFaces();


}