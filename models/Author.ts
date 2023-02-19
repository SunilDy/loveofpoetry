import { Schema, model, models } from 'mongoose';

const AuthorSchema = new Schema({
  name: String,
  images: {
    thumbnail: String,
    poster: String
  },
  description: String,
  about: String,
  titles: [String]
});

const Author = models.authors || model('authors', AuthorSchema);

export default Author;