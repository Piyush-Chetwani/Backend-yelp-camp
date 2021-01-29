var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require('./models/user');
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_app_4", {useNewUrlParser:true, useUnifiedTopology:true});

//APP Config
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
seedDB();

app.use(require("express-session")({
  secret:"This is my little secret",
  resave:false,
  savUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
})

//index routes

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

app.post("/campgrounds", isLoggedIn, function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.desc;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name:name, image:image, description:desc, author:author};
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else{
      res.redirect("/campgrounds");
    }
  });
});

app.get("/campgrounds/new", isLoggedIn, function(req,res){
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


app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground:campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err,comment){
        if(err){
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/"+campground._id);
        }
      })
    }
  })
});


//auth routes

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  User.register(new User({username: req.body.username}), req.body.password, function(err,user){
    if(err){
      console.log(err);
      return res.render('register');
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/campgrounds");
      });
    }
  });
});

app.get("/login", function(req,res){
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}), function(req, res){
});

app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect("/login");
};

app.listen(3000,function() {
	console.log("Server started on port 3000");
});
