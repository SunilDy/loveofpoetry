import { Schema, model, models } from "mongoose";

const SubComment = new Schema({
  date: Date,
  username: String,
  avatar: String,
  comment: String,
})

const Comment = new Schema({
    date: Date,
    username: String,
    avatar: String,
    comment: String,
    likes: [String],
    subcomments: {
      type: [SubComment],
      default: []
    }
})

const TitleSchema = new Schema({
  title: String,
  author: String,
  lines: [String],
  comments: [Comment],
  linesCount: Number
});

const Title = models.titles || model("titles", TitleSchema);

export default Title;
