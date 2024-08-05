import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  createdAt: number;
}

const UserSchema: Schema<IUser> = new Schema({
  clerkId: { type: String, required: true },
  createdAt: { type: Number, default: Date.now, required: true },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
