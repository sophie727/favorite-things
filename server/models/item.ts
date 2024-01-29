import { Schema, model, Document } from "mongoose";

const ItemSchema = new Schema({
  picture: String,
  stars: Number,
  name: String,
  description: String,
  link: String,
  user_id: String,
  private: Boolean,
});

export interface Item extends Document {
  picture: string;
  stars: number;
  name: string;
  description: string;
  user_id: string;
  link: string;
  _id: string;
  private: boolean;
}
const ItemModel = model<Item>("Item", ItemSchema);

export default ItemModel;
