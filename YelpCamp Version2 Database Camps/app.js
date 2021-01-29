var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_app_2", {useNewUrlParser:true, useUnifiedTopology:true});

//APP Config
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
seedDB();

app.get("/", function(req,res){
  res.render("landing")
})

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
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampround){
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
