import { Schema, model, Document } from "mongoose";

const AllTagSchema = new Schema({
  tag: String,
  user_id: String,
});

export interface AllTag extends Document {
  tag: string;
  _id: string;
  user_id: string;
}
const AllTagModel = model<AllTag>("AllTag", AllTagSchema);

export default AllTagModel;
