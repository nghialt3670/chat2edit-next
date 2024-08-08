import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConversation extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  isError: boolean;
  isShared: boolean;
  createdAt: number;
  lastModified: number;
}

const ConversationSchema: Schema<IConversation> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String },
  isError: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now, required: true },
  lastModified: { type: Number, default: Date.now, required: true },
});

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
