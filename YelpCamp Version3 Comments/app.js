var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
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
      res.render("campgrounds/campgrounds", {campgrounds:campgrounds})
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
  res.render("campgrounds/new");
});


app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampround){
    if(err){
      console.log(err)
    } else{
      res.render("campgrounds/show", {campground:foundCampround});
    }
  });
});

//Comments


app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground:campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err,comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/"+campground._id);
        }
      })
    }
  })
})

app.listen(3000,function() {
	console.log("Server started on port 3000");
});
