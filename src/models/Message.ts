import mongoose, { Document, Model, Schema } from "mongoose";

interface IMessage extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  text: string;
  fileIds: string[];
  createdAt: number;
}

const MessageSchema: Schema<IMessage> = new Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  text: { type: String, required: true },
  fileIds: { type: [String], default: [], required: true },
  createdAt: { type: Number, default: Date.now, required: true },
});

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
