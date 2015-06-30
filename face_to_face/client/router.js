console.log("router");

Router.route("/facefinder",  function(){
    console.log("in facefinder route");
    this.render("facefinder");
});
Router.route("/facemorpher", function(){
    console.log("in facemorpher route");
    this.render("facemorpher");
});
Router.route("/imagefinder", function(){
    console.log("in imagefinder route");
    this.render("imagefinder");
});
