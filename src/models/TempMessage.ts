import mongoose, { Document, Model, Schema } from "mongoose";

interface ITempMessage extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  text: string;
  fileIds: mongoose.Schema.Types.ObjectId[];
  createdAt: number;
}

const TempMessageSchema: Schema<ITempMessage> = new Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  text: { type: String, required: true },
  fileIds: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
    required: true,
    expires: process.env.TEMP_CONVERSATION_EXPIRE_TIME,
  },
});

const TempMessage: Model<ITempMessage> =
  mongoose.models.TempMessage ||
  mongoose.model<ITempMessage>("TempMessage", TempMessageSchema);

export default TempMessage;
