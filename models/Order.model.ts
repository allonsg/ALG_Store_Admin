import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Object,
    customer: {
      name: String,
      email: String,
      city: String,
      country: String,
      zip: String,
      street: String,
    },
    paid: Boolean,
  },
  { timestamps: true },
);

export const Order = models.Order || model("Order", OrderSchema);
