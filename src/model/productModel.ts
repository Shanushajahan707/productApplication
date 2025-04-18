import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  productName: string;
  description: string;
  price: number;
  category: string;
  brand: Types.ObjectId;
  productImage: string;
  addedBy: Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    productImage: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ProductModel = model<IProduct>("Product", productSchema);
export default ProductModel;
