const assert = require("assert");
const User = require("../src/user");

describe("Creating records", () => {
  it("saves a user", (done) => {
    const joe = new User({
      name: "Joe",
    });
    //this is asynchronous so we will have use a promise to wait for the user obj to be saved.
    joe
      .save()
      // we need to see if the promise is resolved successfully.
      .then(() => {
        // joe saved successfully?
        assert(!joe.isNew); //we want to assert that joe is already in the db, not new
        done();
      });
  });
});
