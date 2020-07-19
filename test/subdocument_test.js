const assert = require("assert");
const User = require("../src/user");

describe("Sub-documents, posts on users", () => {
  it("makes a sub-document and saves it", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "Post 1" }],
    });
    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 1);
        done();
      });
  });
  it("can add subdocuments to existing users", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [],
    });

    joe
      .save()
      .then(() =>
        User.findOneAndUpdate({ name: "Joe" }, { posts: [{ title: "Bong!" }] })
      )
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.name === "Joe");
        assert(user.posts[0].title === "Bong!");
        done();
      });
  });
  it("can add subdocuments to existing users BUT DIFFERENT", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        user.posts.push({ title: "Bong!" });
        return user.save(); //curly braces mean we don't automatically get a return out of the function!
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.name === "Joe");
        assert(user.posts.length === 1);
        assert(user.posts[0].title === "Bong!");
        done();
      });
  });
  it("can remove embedded sub-documents", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "Bong!" }],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        const post = user.posts[0];
        post.remove();
        return user.save();
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 0);
        done();
      });
  });
});
