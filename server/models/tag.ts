import { Schema, model, Document } from "mongoose";

const TagSchema = new Schema({
  tag: String,
  parent_id: String,
});

export interface Tag extends Document {
  tag: string;
  parent_id: string;
  _id: string;
}
const TagModel = model<Tag>("Tag", TagSchema);

export default TagModel;
