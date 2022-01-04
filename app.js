const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

  .get(function(req, res) {

    Article.find(function(err, fondArticles) {

      if (err) {
        res.send(err);
      } else
        res.send(fondArticles);
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {

      if (err)
        return err;

      else
        res.send("Successfully added a new article.");
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Sucessfully delete all articles");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:articleTitle")

  .get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, fondArticle){
      if(fondArticle){
        res.send(fondArticle);
      }
      else{
        res.send("No article matching title was found.");
      }
    });
  })

  .put(function(req, res){
    Article.updateMany(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully update articles.");
        }
        else{
          res.send(err);
        }
    });
  })

  .patch(function(req, res){
    Article.updateMany(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully update article");
        }
        else{
            res.send(err);
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Successfully delete article");
        }
        else{
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
