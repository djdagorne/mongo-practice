const mongoose = require("mongoose");
const PostSchema = require("./post");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: "Name must be longer than 2 characters.",
    },
    required: [true, "Please provide a name."],
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "blogPost",
    },
  ],
});

UserSchema.virtual("postCount").get(function () {
  //don't use arrow functions, or 'this' refers to the entire doc, scope will be too big
  return this.posts.length;
});

//middleware
// when we delete a user, remove their associated blogposts too
UserSchema.pre("remove", function (next) {
  //no arrow function because we need the scope in this case to be limited to our model when using this middleware function
  const BlogPost = mongoose.model("blogPost");

  BlogPost.deleteMany({ _id: { $in: this.blogPosts } }).then(() => next());
});

const User = mongoose.model("user", UserSchema); //user class/ user model

module.exports = User;
