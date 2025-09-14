import mongoose, { Schema } from "mongoose";
import express from "express";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    channel:{
      type: Schema.Types.ObjectId,
      ref:"User",
    }
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
