import mongoose, { Schema, Document } from "mongoose";

export interface OtpDocument extends Document {
  otp: number;
  email: string;
  name: string;
  password: string;
  role: string;
  isBlocked: boolean;
  createdAt: Date; 
}

const otpSchema = new Schema<OtpDocument>(
  {
    otp: { type: Number, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    email: { type: String, required: true }
  },
  { timestamps: true } 
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const otpModel = mongoose.model<OtpDocument>("Otp", otpSchema);




export interface RecruiterOtpDocument extends Document {
  otp: number;
  email: string;
  name: string;
  password: string;
  role: string;
  isBlocked: boolean;
  companyName: string;
  companyWebsite?: string;
  createdAt: Date;
}

const recruiterOtpSchema = new Schema<RecruiterOtpDocument>(
  {
    otp: { type: Number, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    isBlocked: { type: Boolean, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    companyWebsite: { type: String },
  },
  { timestamps: true, collection: "recruiter_otps" } 
);

recruiterOtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const RecruiterOtpModel = mongoose.model<RecruiterOtpDocument>(
  "RecruiterOtp",
  recruiterOtpSchema
);
