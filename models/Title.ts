import { Schema, model, models } from "mongoose";


const Comment = new Schema({
    date: Date,
    username: String,
    avatar: String,
    comment: String,
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
