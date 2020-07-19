const assert = require("assert");
const User = require("../src/user");

describe("Updating records", () => {
  let joe;

  beforeEach((done) => {
    joe = new User({ name: "Joe", likes: 0 });
    joe.save().then(() => done());
  });

  function assertName(operation, done) {
    operation
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name !== "Joe");
        done();
      });
  }

  it("instance updating using .set & .save", (done) => {
    joe.set("name", "Alex");
    assertName(joe.save(), done);
  });

  it("an instance update using .updateOne", (done) => {
    assertName(joe.updateOne({ name: "Alex" }), done);
  });

  it("A model class can update", (done) => {
    assertName(User.updateOne({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("A model class can .findOneAndUpdate", (done) => {
    assertName(User.findOneAndUpdate({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("A model class can .findByIdAndUpdate", (done) => {
    assertName(User.findByIdAndUpdate(joe._id, { name: "Alex" }), done);
  });

  it("a user can have their likes increased by 1", (done) => {
    User.updateOne({ name: "Joe" }, { $inc: { likes: 1 } })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.likes === joe.likes + 1);
        done();
      });
  });
});
