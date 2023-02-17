import { Schema, model, models } from 'mongoose';

const LikedPoemsType = new Schema({
  title: String,
  author: String
})

export const CollectionSchema = new Schema({
  name: String,
  titles: [LikedPoemsType]
})

const LineSchema = new Schema({
  line: String,
  comment: String
})

const StudySchema = new Schema({
  title: String,
  author: String,
  lines: [LineSchema],
  notes: String
})

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
  refresh_token_expires_in: String,
  likedPoems: {
    type: [LikedPoemsType],
  },
  collections: {
    type: [CollectionSchema]
  },
  studies: {
    type: [StudySchema]
  }
});

const User = models.users || model('users', UserSchema);

export default User;

export type StudyType = {
  title: string;
  author: string;
  lines: {
    line: string;
    comment: string;
  }[],
  notes: string;
}

export type UserType = {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  refresh_token_expires_in: string;
  likedPoems: string[]
  collections: {
    _id: string;
    name: string;
    titles: string[]
  }[],
  studies: StudyType[]
}