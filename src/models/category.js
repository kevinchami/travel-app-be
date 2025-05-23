// --- models/category.js ---
import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: false },
    route: { type: String, required: true },
    conditionalCity: [{ type: String }],
    soon: { type: Boolean, default: false },
    showOnMap: { type: Boolean, default: false },
    onlyOnMap: { type: Boolean, default: false },
    hide: { type: Boolean, default: false },
    priority: { type: Number, default: 0 }
  },
  { timestamps: true },
);

const Category = model('Category', categorySchema);
export default Category;
