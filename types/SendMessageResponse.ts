import ResponseMessage from "./ResponseMessage";

export default interface SendMessageResponse {
  newChatId?: string;
  savedRequestMessage: boolean;
  responseMessage?: ResponseMessage;
}
