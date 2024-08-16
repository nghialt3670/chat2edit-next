export default interface Message {
  id: string;
  type: "Request" | "Response";
  text: string;
  fileIds: string[];
}
