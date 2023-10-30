import { ObjectId, Schema, model, models } from "mongoose";

export interface IKeywordRankings {
  domain: string;
  keyword: string;
  owner: string;
  rank: number;
  searchResultSize: number;
  createdAt: string;
  _id: ObjectId;
}

const KeywordRankingSchema = new Schema(
  {
    domain: { type: String, required: true },
    keyword: { type: String, required: true },
    owner: { type: String, required: true },
    rank: { type: Number },
    searchResultSize: { type: Number },
  },
  { timestamps: true }
);

export const KeywordRanking =
  models?.KeywordRanking || model("KeywordRanking", KeywordRankingSchema);
