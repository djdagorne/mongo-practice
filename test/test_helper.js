const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

before(() => {
  mongoose.connect("mongodb://localhost/users_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.connection
    .once("open", () => {})
    .on("error", (error) => {
      console.warn("Warning", error);
    });
});

beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections; //mongoose normallizes collection names by lowercasing them
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
