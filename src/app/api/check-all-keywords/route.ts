import mongoose from "mongoose";
import { Keyword } from "@/models/Keywords";
import { KeywordRanking } from "@/models/KeywordRanking";
import { getOrganicResults } from "@/libs/rankingFunctions";

export async function GET(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const keywordsDocs = await Keyword.find();

  const getOrganicResultsPromises = [];
  const keywordRankingCreatePromises = [] as any[];
  for (const keywordDoc of keywordsDocs) {
    const getOrganicResultsPromise = getOrganicResults(
      keywordDoc.domain,
      keywordDoc.keyword
    );
    getOrganicResultsPromise.then((res) => {
      const keywordRankingCreatePromise = KeywordRanking.create({
        domain: keywordDoc.domain,
        keyword: keywordDoc.keyword,
        owner: keywordDoc.owner,
        rank: res.rank + 1,
        searchResultSize: res.size,
      });
      keywordRankingCreatePromises.push(keywordRankingCreatePromise);
    });
    getOrganicResultsPromises.push(getOrganicResultsPromise);
  }
  await Promise.allSettled([
    ...getOrganicResultsPromises,
    ...keywordRankingCreatePromises,
  ]);
  return Response.json(true);
}
