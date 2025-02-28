import mongoose, { Document, Schema } from 'mongoose';

export interface ITrack extends Document {
  title: string;
  artist: string;
  description?: string;
  coverImage?: string;
  audioFile: string; // URL to S3
  duration: number; // in seconds
  genre?: string;
  tags?: string[];
  user: mongoose.Types.ObjectId; // Reference to User
  plays: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const trackSchema = new Schema<ITrack>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String, // URL to S3
    },
    audioFile: {
      type: String, // URL to S3
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    tags: [String],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plays: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для эффективного поиска
trackSchema.index({ title: 'text', artist: 'text', description: 'text', tags: 'text' });
trackSchema.index({ genre: 1 });
trackSchema.index({ user: 1 });

export default mongoose.model<ITrack>('Track', trackSchema);