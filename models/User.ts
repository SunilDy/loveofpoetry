import { Schema, model, models } from 'mongoose';

const CollectionSchema = new Schema({
  name: String,
  titles: [String]
})

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
  refresh_token_expires_in: String,
  likedPoems: [String],
  collections: [CollectionSchema]
});

const User = models.users || model('users', UserSchema);

export default User;