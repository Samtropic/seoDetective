import { Schema, model, models } from "mongoose";

const domainRegex = /[a-z0-9]+\.[a-z0-9\.]+/;

export interface IDomain {
  _id: string;
  domain: string;
  owner: string;
  icon: string;
}

const DomainSchema = new Schema(
  {
    domain: {
      type: String,
      required: true,
      validate: (val: string) => domainRegex.test(val),
    },
    owner: { type: String, required: true },
    icon: { type: String },
  },
  { timestamps: true }
);

DomainSchema.index({ domain: 1, owner: 1 }, { unique: true });

export const Domain = models?.Domain || model("Domain", DomainSchema);
