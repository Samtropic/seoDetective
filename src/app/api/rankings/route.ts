import mongoose from "mongoose";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { KeywordRanking } from "@/models/KeywordRanking";
import { getOrganicResults } from "@/libs/rankingFunctions";

export async function POST(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const data = await req.json();
  console.log("###### RANKING (POST) ########");
  console.log(data);
  console.log("##############################");
  const session = await getServerSession(authOptions);
  const rankingDocument = await KeywordRanking.findOne({
    domain: data.domain,
    keyword: data.keyword,
    owner: session?.user?.email,
  });
  let currentRanking = await getOrganicResults(data.domain, data.keyword);
  if (
    rankingDocument &&
    currentRanking.rank.toString() &&
    currentRanking.size.toString()
  ) {
    rankingDocument.rank = currentRanking.rank + 1;
    rankingDocument.searchResultSize = currentRanking.size;
    await rankingDocument.save();
  }

  return Response.json(rankingDocument);
}

export async function GET(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  return Response.json(await KeywordRanking.findById(id));
}
