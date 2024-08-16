export default interface SendMessageRequest {
  conversationId: string;
  text: string;
  fileIds: string[];
}
