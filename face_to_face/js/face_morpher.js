

if (Meteor.isClient) {


    Meteor.subscribe("publication"); // this is so we can listen to the images

    var currentImage = false;
    var currentObject = false;

    var previousImage = false; 
    var previousObject = false;

    var db_ready = false;
    var template_ready = false;


    var morphtime = 6000;
    var waitTime = 2000;

    var largeTriangleSet = [

    [71,72,21],
    [72,21,22],
    [72,22,18],
    [18,17,72],
    [17,72,73],
    [17,16,73],
    [16,15,73],
    [15,73,74],
    [15,14,74],
    [14,13,74],
    [13,12,74],
    [74,12,11],
    [74,75,11],
    [10,11,75],
    [9,10,75],
    [9,75,76],
    [8,9,76],
    [7,8,76],
    [6,7,76],
    [5,6,76],
    [5,76,77],
    [4,5,77],
    [3,4,77],
    [3,77,78],
    [2,3,78],
    [1,2,78],
    [0,1,78],
    [19,0,78],
    [19,71,78],
    [19,20,71],
    [20,21,71],
    [0,19,23],
    [0,26,34],
    [0,23,26],
    [0,1,34],
    [1,34,35],
    [1,2,35],
    [2,35,36],
    [2,3,36],
    [3,36,44],
    [3,4,44],
    [4,5,44],
    [5,44,55],
    [5,6,55],
    [6,54,55],
    [6,7,54],
    [7,54,53],
    [7,53,52],
    [7,8,52],
    [8,52,51],
    [8,9,51],
    [9,51,50],
    [9,10,50],
    [10,11,50],
    [11,50,38],
    [11,12,38],
    [12,38,39],
    [12,39,13],
    [13,39,40],
    [13,14,40],
    [14,31,40],
    [14,31,28],
    [15,28,14],
    [15,28,29],
    [15,16,29],
    [16,17,29],
    [17,18,29],
    [18,29,30],
    [18,33,30],
    [18,22,33],
    [19,23,24],
    [19,20,24],
    [20,21,24],
    [21,22,24],
    [22,24,25],
    [22,25,33],
    [23,24,26],
    [24,25,26],
    [25,33,34],
    [25,26,34],
    [28,29,31],
    [29,30,31],
    [30,33,40],
    [30,31,40],
    [33,40,62],
    [33,34,62],
    [34,35,62],
    [35,36,62],
    [36,37,62],
    [36,44,48],
    [36,37,48],
    [37,46,48],
    [37,46,47],
    [37,47,48],
    [37,48,49],
    [37,38,49],
    [37,38,62],
    [38,39,62],
    [38,49,50],
    [39,40,62],
    [44,45,61],
    [44,61,56],
    [44,55,56],
    [45,46,61],
    [46,60,61],
    [46,47,60],
    [47,48,60],
    [48,59,60],
    [48,49,59],
    [49,50,59],
    [50,58,59],
    [50,51,58],
    [51,52,58],
    [52,57,58],
    [52,53,57],
    [53,54,57],
    [54,56,57],
    [54,55,56],
    [56,60,61],
    [56,57,60],
    [57,58,60],
    [58,59,60],
    ];


    function generateTrianglesLarge(positions){
        return largeTriangleSet;
//      return smallTriangleSet;
    }


    Meteor.subscribe('face_images_ready', function(){
        db_ready = true;
        console.log("data is ready");
        //Set the reactive session as true to indicate that the data have been loaded
        if(db_ready && template_ready){
            console.log("gonna morph now");
            morpherLoop();
        }
    });


    Template.facemorpher.rendered = function(){
        console.log("facemorpher rendered");
        template_ready = true;
        if(db_ready && template_ready){
            console.log("gonna morph now");            
            morpherLoop();
        }
    }


    function morpherLoop(){

        if(!previousObject){
            console.log("getting first round");
            previousObject = getRandImage({faces_found : true});
        }else{
            previousObject = currentObject;
        }
        do{
            currentObject = getRandImage({faces_found : true});
        }while(currentObject._id == previousObject._id);


        console.log("*************************");
        console.log("previous: ");
        console.log(previousObject);
        console.log("current");
        console.log(currentObject);
        console.log("*************************");

        var imagename1 = previousObject.image_large;
        var imagename2 = currentObject.image_large;

        imagename1 = convertProxyImage(imagename1, 500);
        imagename2 = convertProxyImage(imagename2, 500);


        var positions1 = previousObject.face_positions;
        var positions2 = currentObject.face_positions;

        var width1 = (previousObject.width ? previousObject.width : 500);
        var height1 = (previousObject.height ? previousObject.height : 500);

        var width2 = (currentObject.width ? currentObject.width : 500);
        var height2 = (currentObject.height ? currentObject.height : 500);

        morph2faces(imagename1, positions1, width1, height1, imagename2, positions2, width2, height2, function(){
            console.log("completed morph");
            setTimeout(morpherLoop, waitTime);
        })

       // setTimeout(morpherLoop, 3000);

    }


    var firstMorph = true;
    function morph2faces(image1, positions1, width1, height1, image2, positions2, width2, height2, callback){

        console.log("morphing faces");

        var image1width = width1;
        var image1height = height1;
        var image2width = width2
        var image2height = height2;

        positions1.push([0,0]);  // 71  ul
        positions1.push([image1width / 2, 0]); // 72 um
        positions1.push([image1width, 0]); //73 ur
        positions1.push([image1width, image1height /2]); //74 mr
        positions1.push([image1width, image1height]); //75 lr
        positions1.push([image1width / 2, image1height]); //76 lm
        positions1.push([0, image1height]); //77 ll
        positions1.push([0, image1height / 2]);  //78 ml
        positions1.push([image1width / 2, image1height / 2]);  //79 center

        positions2.push([0,0]);  // 71
        positions2.push([image2width / 2, 0]); // 72
        positions2.push([image2width, 0]); //73
        positions2.push([image2width, image2height /2]); //74
        positions2.push([image2width, image2height]); //75
        positions2.push([image2width / 2, image2height]); //76
        positions2.push([0, image2height]); //77
        positions2.push([0, image2height / 2]);  //78
        positions2.push([image2width / 2, image2height / 2]);  //79 center


        var json = {images: [{src:image1, points : []},{src:image2, points : []}], triangles : []};

        json.triangles = generateTrianglesLarge(positions1);

        for(var i=0; i<positions1.length; i++){
            var position1 = positions1[i];
            var position2 = positions2[i];
            if(position1 && position2){
                json.images[0].points.push({x : position1[0], y: position1[1]});
                json.images[1].points.push({x : position2[0], y: position2[1]});
            }
        }

        if(firstMorph){
            firstMorph = false;
            console.log("new morpher");
            morpher = new Morpher(json);

            $("#morpherhere").html(morpher.canvas);

            morpher.on("animation:complete", function(){
                console.log("complete");
                callback();

            });


            morpher.set([1, 0]);
            morpher.animate([0, 1], morphtime);

        }else{
            console.log("reusing morpher");

            prevMorpher = morpher;
            morpher = new Morpher(json);


            morpher.on("animation:complete", function(){
                console.log("complete");
                callback();

            });

            morpher.on("load", function(themorpher){
                console.log("new load");
                delete prevMorpher;
                $("#morpherhere").html(morpher.canvas);
                morpher.set([1]);
                morpher.animate([0, 1], morphtime);
            });

        }
        
    }


}