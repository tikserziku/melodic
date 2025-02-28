import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  coverImage?: string;
  tracks: mongoose.Types.ObjectId[]; // References to Track
  user: mongoose.Types.ObjectId; // Reference to User
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    name: {
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
    tracks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Track',
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для эффективного поиска
playlistSchema.index({ name: 'text', description: 'text' });
playlistSchema.index({ user: 1 });
playlistSchema.index({ isPublic: 1 });

export default mongoose.model<IPlaylist>('Playlist', playlistSchema);