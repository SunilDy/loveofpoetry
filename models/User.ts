import { Schema, model, models } from 'mongoose';

export const CollectionSchema = new Schema({
  name: String,
  titles: [String]
})

const LikedPoemsType = new Schema({
  title: String,
  author: String
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
  // likedPoems: [String],
  collections: {
    type: [CollectionSchema]
  }
});

const User = models.users || model('users', UserSchema);

export default User;

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
  }[]
}