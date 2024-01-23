import { Schema, model, Document } from "mongoose";

const LinkSchema = new Schema({
  link: String,
  parent_id: String,
});

export interface Link extends Document {
  link: string;
  parent_id: string;
  _id: string;
}
const LinkModel = model<Link>("Link", LinkSchema);

export default LinkModel;
