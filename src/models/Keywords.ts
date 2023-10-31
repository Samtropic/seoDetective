import { Schema, model, models } from "mongoose";

export interface IKeyword {
  _id: string;
  domain: string;
  keyword: string;
  owner: string;
}

const KeywordSchema = new Schema(
  {
    domain: { type: String, required: true },
    keyword: {
      type: String,
      required: true,
      validate: (val: string) => val.length > 0,
    },
    owner: { type: String, required: true },
  },
  { timestamps: true }
);

export const Keyword = models?.Keyword || model("Keyword", KeywordSchema);
