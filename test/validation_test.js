const assert = require("assert");
const User = require("../src/user");

describe("Validating records", () => {
  it("requires a user name", (done) => {
    const user = new User({ name: undefined });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;
    // don't use user.validate(()=>{/* validation code here */}), its reserved for non-synchronous validations that require extra functionality
    assert(message === "Please provide a name.");
    done();
  });
  it("requires the name be more than 2 characters long", (done) => {
    const user = new User({ name: "Na" });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === "Name must be longer than 2 characters.");
    done();
  });
  it("doesn't allow invalid records from being saved", (done) => {
    const user = new User({ name: "al" });
    user.save().catch((validationResult) => {
      const { message } = validationResult.errors.name;
      assert(message === "Name must be longer than 2 characters.");
      done();
    });
  });
});
