import { Schema, model, models } from 'mongoose';

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

const UserTitleSchema = new Schema({
  title: String,
  author_name: String,
  author_email: String,
  avatar: String,
  lines: [String],
  linesCount: Number,
  created_on: Date,
  likes: {
    type: [String],
    default: []
  },
  comments: {
    type: [Comment],
    default: [],
  }
});

export type UserTitleType = {
    _id: string,
    title: string,
    author_name: string,
    author_email: string,
    avatar: string,
    lines: string[],
    linesCount: number,
    created_on: Date,
    likes: string[],
    comments: string[],
    isLiked: boolean
}

const UserTitle = models.usertitles || model('usertitles', UserTitleSchema);

export default UserTitle;

