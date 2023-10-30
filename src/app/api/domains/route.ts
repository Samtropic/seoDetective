import { Domain } from "@/models/Domains";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";
import DomParser from "dom-parser";
import { Keyword } from "@/models/Keywords";
import { KeywordRanking } from "@/models/KeywordRanking";

async function getIconUrl(domain: string) {
  const response = await axios.get(`https://` + domain);
  const parser = new DomParser();
  const parsedHtml = parser.parseFromString(response.data);
  const links = parsedHtml.getElementsByTagName("link");
  let href = "";
  if (links?.length != 0) {
    for (const link of links as DomParser.Node[]) {
      const rel = link.getAttribute("rel");
      if (rel && rel.includes("icon")) {
        href = link.getAttribute("href") || "";
      }
    }

    if (href?.includes("://")) {
      return href;
    } else {
      return `https://` + domain + href;
    }
  } else return "";
}

export async function POST(req: Request): Promise<Response> {
  const data = await req.json();
  mongoose.connect(process.env.MONGODB_URI as string);
  const session = await getServerSession(authOptions);
  let icon = null;
  try {
    icon = await getIconUrl(data?.domain);
  } catch (error) {
    console.error(error);
  }
  const document = await Domain.create({
    domain: data?.domain,
    owner: session?.user?.email,
    icon,
  });
  return Response.json(document);
}

export async function GET() {
  mongoose.connect(process.env.MONGODB_URI as string);
  const session = await getServerSession(authOptions);
  const domains = await Domain.find({
    owner: session?.user?.email,
  });
  const keywords = await Keyword.find({
    owner: session?.user?.email,
    domain: domains.map((doc) => doc.domain),
  });
  return Response.json({
    domains,
    keywords,
  });
}

export async function DELETE(req: Request) {
  mongoose.connect(process.env.MONGODB_URI as string);
  const url = new URL(req.url);
  const domain = url.searchParams.get("domain");
  const session = await getServerSession(authOptions);
  const domainDelDoc = await Domain.deleteOne({
    owner: session?.user?.email,
    domain,
  });
  const keywordDelDoc = await Keyword.deleteMany({
    owner: session?.user?.email,
    domain,
  });
  const ranksDelDoc = await KeywordRanking.deleteMany({
    owner: session?.user?.email,
    domain,
  });
  return Response.json({
    keywordDelDoc,
    domainDelDoc,
    ranksDelDoc,
  });
}
