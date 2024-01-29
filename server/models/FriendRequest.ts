import { Schema, model, Document } from "mongoose";

const FriendRequestSchema = new Schema({
  first_id: String,
  second_id: String,
  accepted: Boolean,
});

export interface FriendRequest extends Document {
  first_id: string;
  second_id: string;
  accepted: boolean;
  _id: string;
}
const FriendRequestModel = model<FriendRequest>("FriendRequest", FriendRequestSchema);

export default FriendRequestModel;
