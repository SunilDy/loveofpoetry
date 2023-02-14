import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
  refresh_token_expires_in: String
});

const User = models.users || model('users', UserSchema);

export default User;