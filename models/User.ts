import { Schema, model, models } from 'mongoose';

const LikedPoemsType = new Schema({
  title: String,
  author: String
})

const LikedUserTitles = new Schema({
  author_email: String,
  title: String
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
  notes: String,
  lastUpdatedAt: Date
})

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
  refresh_token_expires_in: String,
  likedPoems: {
    type: [LikedPoemsType],
    default: []
  },
  collections: {
    type: [CollectionSchema]
  },
  studies: {
    type: [StudySchema],
    default: []
  },
  bio: {
    type: String,
    default: ""
  },
  personalSite: {
    type: String,
    default: ""
  },
  posts: {
    type: [String],
    default: []
  },
  likedUserTitles: {
    type: [LikedUserTitles],
    default: []
  }
});

const User = models.users || model('users', UserSchema);
export default User;

export type LineType = {
  line: string;
  comment: string;
}

export type StudyType = {
  title: string;
  author: string;
  lines: {
    line: string;
    comment: string;
  }[],
  notes: string;
  lastUpdatedAt: Date;
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
  studies: StudyType[],
  personalSite: string,
  bio: string,
  posts: string[]
}