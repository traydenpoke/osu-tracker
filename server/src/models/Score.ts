import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ScoreSchema = new Schema(
  {
    user: {
      id: Number,
      username: String,
    },
    score: {
      pp: Number,
      title: String,
      playID: Number,
      accuracy: Number,
      mods: [String],
      passed: Boolean,
      statistics: {
        ctMiss: Number,
        ct50: Number,
        ct100: Number,
        ct300: Number,
      },
    },
  },
  {
    collection: 'scores',
  }
);

const ScoreModel = mongoose.model('Score', ScoreSchema);

export default ScoreModel;
