import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITempConversation extends Document {
  createdAt: number;
  lastModified: number;
}

const TempConversationSchema: Schema<ITempConversation> = new Schema(
  {
    createdAt: {
      type: Number,
      default: Date.now,
      required: true,
      expires: process.env.TEMP_CONVERSATION_EXPIRE_SECONDS,
    },
    lastModified: { type: Number, default: Date.now, required: true },
  },
  { collection: "temp-conversations" },
);

const TempConversation: Model<ITempConversation> =
  mongoose.models.TempConversation ||
  mongoose.model<ITempConversation>("TempConversation", TempConversationSchema);

export default TempConversation;
