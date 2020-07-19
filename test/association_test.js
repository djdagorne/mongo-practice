const assert = require("assert");
const User = require("../src/user");
const BlogPost = require("../src/blogPost");
const Comment = require("../src/comment");

describe("Associations", () => {
  let joe, blogPost, comment;
  beforeEach((done) => {
    joe = new User({
      name: "Joe",
    });
    blogPost = new BlogPost({
      title: "Bongo",
      content: "Dongo Longo",
    });
    comment = new Comment({
      content: "Yes indeed.",
    });

    //making associations has to be VERY direct.
    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    // for a singular 'has one' relationship, we use an =, not .push
    comment.user = joe;

    //none of this persists in the db yet, so we need to save it to the db
    //we want to do this using Promise.all so that we don't have messy promises
    Promise.all([joe.save(), blogPost.save(), comment.save()])
      //these promises are done in parallel, so it should take as long only the longest operation
      .then(() => {
        done();
      });
  });

  it("saves a relation between a user and a blog post", (done) => {
    User.findOne({ name: "Joe" })
      .populate("blogPosts") //one argument here means you're providing only a path argument
      .then((user) => {
        assert(user.blogPosts[0].title === "Bongo");
        done();
      });
  });

  it("saves a full relation graph", (done) => {
    User.findOne({ name: "Joe" })
      .populate({
        path: "blogPosts",
        populate: {
          path: "comments",
          model: "comment",
          populate: {
            path: "user",
            model: "user",
          },
        },
      })
      .then((user) => {
        //console.log(user.blogPosts[0].comments[0]); //works
        assert(user.name === "Joe");
        assert(user.blogPosts[0].title === "Bongo");
        assert(user.blogPosts[0].comments[0].content === "Yes indeed.");
        assert(user.blogPosts[0].comments[0].user.name === "Joe");
        done();
      });
  });
});
