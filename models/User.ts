import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  avatar?: string;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
