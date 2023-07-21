import { model, models, Schema, Types } from "mongoose";

const CategorySchema = new Schema({
  categoryName: { type: String, required: true },
  parentCategory: { type: Types.ObjectId, ref: "Category" },
});

export const Category = models.Category || model("Category", CategorySchema);
