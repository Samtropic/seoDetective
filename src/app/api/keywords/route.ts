import { Keyword } from "@/models/Keywords";
import mongoose from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { KeywordRanking } from "@/models/KeywordRanking";

export async function POST(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const data = await req.json();
  const session = await getServerSession(authOptions);
  const keywordsDocument = await Keyword.create({
    domain: data.domain,
    keyword: data.keyword,
    owner: session?.user?.email,
  });
  await KeywordRanking.create({
    domain: data.domain,
    keyword: data.keyword,
    owner: session?.user?.email,
  });

  return Response.json(keywordsDocument);
}

export async function GET(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const url = new URL(req.url);
  const domain = url.searchParams.get("domain");
  const session = await getServerSession(authOptions);
  const keywordsDocuments = await Keyword.find({
    owner: session?.user?.email,
    domain: domain,
  });
  const keywordRankingDocuments = await KeywordRanking.find({
    owner: session?.user?.email,
    domain: domain,
    keyword: keywordsDocuments.map((doc) => doc.keyword),
  });
  return Response.json({
    keywords: keywordsDocuments,
    ranks: keywordRankingDocuments,
  });
}

export async function DELETE(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const url = new URL(req.url);
  const keyword = url.searchParams.get("keyword");
  const domain = url.searchParams.get("domain");
  const session = await getServerSession(authOptions);
  const keyDelDoc = await Keyword.deleteOne({
    owner: session?.user?.email,
    domain,
    keyword,
  });
  const rankDelDoc = await KeywordRanking.deleteOne({
    owner: session?.user?.email,
    domain: domain,
    keyword: keyword,
  });
  return Response.json({
    keyDelDoc,
    rankDelDoc,
  });
}
