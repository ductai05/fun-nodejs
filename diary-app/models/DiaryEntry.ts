import mongoose, { Schema, model, models } from 'mongoose';

export interface IDiaryEntry {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiaryEntrySchema = new Schema<IDiaryEntry>({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
  },
  content: {
    type: String,
    required: [true, 'Nội dung là bắt buộc'],
  },
  authorId: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const DiaryEntry = models.DiaryEntry || model<IDiaryEntry>('DiaryEntry', DiaryEntrySchema);

export default DiaryEntry;
