var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp_app", {useNewUrlParser:true, useUnifiedTopology:true});

//APP Config
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.render("landing")
})

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({
  name:"a",
  image:"https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e5077497c2d7ed09f4ac7_340.png",
  description: "akjhgcxcvhjkjhgfcxchjkjhgfdx"
}, function(err, campground){
  if(err){
    console.log(err);
  } else{
    console.log(campground);
  }
});

//campgrounds=[
//  {name:"a", image:"https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e5077497c2d7ed09f4ac7_340.png"},
//  {name:"b", image:"https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e5077497c2d7ed09f4ac7_340.jpg"},
//  {name:"c", image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e5077497c2d7ed09f4ac7_340.jpg"}
//]

app.get("/campgrounds", function(req,res){
  Campground.find({}, function(err,campgrounds){
    if(err){
      console.log(err);
    } else{
      res.render("campgrounds", {campgrounds:campgrounds})
    }
  })
});

app.post("/campgrounds", function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var newCampground = {name:name, image:image, description:desc};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else{
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", function(req,res){
  res.render("new");
});

app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id, function(err,foundCampround){
    if(err){
      console.log(err)
    } else{
      res.render("show", {campground:foundCampround});
    }
  });
});

app.listen(3000,function() {
	console.log("Server started on port 3000");
});
