import { Schema, model, models } from 'mongoose';

const Comment = new Schema({
    date: Date,
    username: String,
    avatar: String,
    comment: String,
})

const PoemSchema = new Schema({
  name: String,
  comments: [Comment]
});

const Poem = models.poems || model('poems', PoemSchema);

export default Poem;

