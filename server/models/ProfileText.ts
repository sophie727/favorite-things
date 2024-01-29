import { Schema, model, Document } from "mongoose";

const ProfileTextSchema = new Schema({
  picture: String,
  name: String,
  description: String,
  user_id: String,
});

export interface ProfileText extends Document {
  picture: string;
  name: string;
  description: string;
  user_id: string;
  _id: string;
}
const ProfileTextModel = model<ProfileText>("ProfileText", ProfileTextSchema);

export default ProfileTextModel;
