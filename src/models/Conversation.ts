import mongoose, { Document, Model, Schema } from "mongoose";

export interface IConversation extends Document {
  title: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: number;
  lastModified: number;
}

const ConversationSchema: Schema<IConversation> = new Schema({
  title: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Number, default: Date.now, required: true },
  lastModified: { type: Number, default: Date.now, required: true },
});

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
