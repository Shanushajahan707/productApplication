import { Schema, model, Document, Types } from "mongoose";

export interface IBrand extends Document {
  _id: Types.ObjectId;
  brandName: string;
  brandLogo: string;
  categories: string[];
  description: string;
  createdBy: Types.ObjectId;
}

const brandSchema: Schema<IBrand> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    brandName: { type: String, required: true, unique: true },
    brandLogo: { type: String, required: true },
    categories: [{ type: String, required: true }],
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const BrandModel = model<IBrand>("Brand", brandSchema);
export default BrandModel;
