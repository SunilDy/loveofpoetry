import { Schema, model, models } from 'mongoose';

const Comment = new Schema({
    date: Date,
    username: String,
    avatar: String,
    comment: String,
})

const UserTitleSchema = new Schema({
  title: String,
  author_name: String,
  author_email: String,
  avatar: String,
  lines: [String],
  linesCount: Number,
  created_on: Date,
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: [Comment],
    default: []
  }
});

export type UserTitleType = {
    title: string,
    author_name: string,
    author_email: string,
    avatar: string,
    lines: string[],
    linesCount: number,
    created_on: Date,
    likes: number,
    comments: string[]
}

const UserTitle = models.usertitles || model('usertitles', UserTitleSchema);

export default UserTitle;

