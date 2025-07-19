import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  room?: mongoose.Types.ObjectId | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
});

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema); 