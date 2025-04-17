import { Schema, model, Document } from "mongoose";
import { IUser } from "../entities/user";

export interface IUserModel extends Omit<IUser, "_id">, Document {}

const UserSchema: Schema<IUserModel> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
  },
  isBlocked: { type: Boolean, required: true },
  profilePicture: { type: String, required: false },
  blockedUser:{type: [String], required: false},
});

const UserModel = model<IUserModel>("User", UserSchema);

export default UserModel;
