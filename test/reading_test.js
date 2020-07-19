const assert = require("assert");
const User = require("../src/user");

describe("Reading users out of the db", () => {
  let joe, maria, alex, zach;

  beforeEach((done) => {
    alex = new User({
      name: "alex",
    });
    maria = new User({
      name: "maria",
    });
    zach = new User({
      name: "zach",
    });
    joe = new User({
      name: "Joe",
    });

    Promise.all([alex.save(), joe.save(), maria.save(), zach.save()]).then(
      () => {
        done();
      }
    );
  });
  it("finding all users with name of joe", (done) => {
    //User is a mongoose.model class object, so it comes with built in functions to help make these models searchable in a db.
    User.find({ name: "Joe" }).then((users) => {
      // assert(users[0]._id === joe._id); //this will fail because _id is not a raw string (even if it logs like one), its actually an object of ObjectId("youridhere"). Even though their id is the same, they don't point to the same value in the computers memory, therefor its not going to pass.
      //what we need to do is convert them to a string, so they have the same primitive value, not different objects pointing to a same primitive.
      assert(users[0]._id.toString() === joe._id.toString());
      done();
    });
  });
  it("find a user with a particular id", (done) => {
    // we don't convert toString() here because we are doing this all internally within mongoose's tool set
    User.findOne({ _id: joe._id }).then((user) => {
      assert(user.name === "Joe");
      done();
    });
  });
  it.only("can skip and limit the regular set", (done) => {
    User.find({})
      .sort({ name: 1 }) // this key and value pair will decide what the initial result will return, in this case its name sorted alphanumerically
      .skip(1)
      .limit(2)
      .then((users) => {
        assert(users.length === 2);
        assert(users[0].name === "alex");
      });
    done();
  });
});
