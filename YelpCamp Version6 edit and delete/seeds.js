var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
  {
    name:"a",
    image:"https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e5077497c2d7ed09f4ac7_340.png",
    description:"verrry good"
  },
  {
    name:"b",
    image:"https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e5077497c2d7ed09f4ac7_340.png",
    description:"very"
  },
  {
    name:"c",
    image:"kjhgc",
    description:"good"
  }
]


function seedDB(){
  //empty database
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }
    console.log("removed database");
    //add pre defined items
    data.forEach(function(seed){
      Campground.create(seed, function(err,campground){
        if(err){
          console.log(err);
        } else {
          console.log("added!");
          //add comments(same for all the post)
          Comment.create(
            {
              text:"very good place, enjoyed it!",
              author:"Jim Parker"
            }, function(err,comment){
              if(err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("created a new comment!");
              }
            }
          )
        }
      })
    })
  });
};

module.exports = seedDB;
