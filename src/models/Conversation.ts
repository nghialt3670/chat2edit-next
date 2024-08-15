import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IConversation extends Document {
  userId: mongoose.Schema.Types.ObjectId
  title: string | null
  isError: boolean
  shareId: string | null
  createdAt: number
  lastModified: number
}

const ConversationSchema: Schema<IConversation> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, default: null },
  isError: { type: Boolean, default: false },
  shareId: { type: String, default: null },
  createdAt: { type: Number, default: Date.now, required: true },
  lastModified: { type: Number, default: Date.now, required: true }
})

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema)

export default Conversation
