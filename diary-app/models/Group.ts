import mongoose, { Schema, model, models } from 'mongoose';

export interface IGroup {
  _id: string;
  groupId: string;
  groupPassword: string;
  adminId: string;
  adminName: string;
  createdAt: Date;
  updatedAt?: Date;
}

const GroupSchema = new Schema<IGroup>({
  groupId: {
    type: String,
    required: [true, 'Group ID là bắt buộc'],
    unique: true,
  },
  groupPassword: {
    type: String,
    required: [true, 'Mật khẩu nhóm là bắt buộc'],
    minlength: 4,
  },
  adminId: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Group = models.Group || model<IGroup>('Group', GroupSchema);

export default Group;
