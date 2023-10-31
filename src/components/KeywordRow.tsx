import { IKeywordRankings } from "@/models/KeywordRanking";
import { IKeyword } from "@/models/Keywords";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Chart from "./Chart";

interface KeywordRowProps {
  keywordProps: IKeyword;
  rankProps: Array<IKeywordRankings>;
}

const KeywordRow = ({ ...props }: KeywordRowProps) => {
  const latestResult = props.rankProps.reverse()[0];
  const [latestRank, setLatestRank] = useState(latestResult.rank);
  useEffect(() => {
    setTimeout(checkRank, 3000);
  }, [latestRank]);

  function checkRank() {
    if (!latestRank) {
      const url = `/api/rankings?id=` + latestResult._id.toString();
      axios
        .get(url, {
          // query URL without using browser cache
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => {
          const newRankFromDb = res.data.rank;
          if (newRankFromDb?.toString()) {
            setLatestRank(newRankFromDb);
          } else {
            setTimeout(checkRank, 3000);
          }
        });
    }
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-orange-200 border-b-4 p-4 pr-0 rounded-lg my-3 hover:bg-light-orange hover:text-medium-orange">
      <Link
        href={
          "/domains/" +
          props.keywordProps.domain +
          "/" +
          encodeURIComponent(props.keywordProps.keyword)
        }
        className="font-bold grow block"
      >
        {props.keywordProps.keyword}
      </Link>
      {!isNaN(latestRank) && latestRank.toString() === "0" && (
        <div className="text-center bg-light-orange inline-block p-1 mr-1 rounded-md text-xs">
          Not available or unranked
        </div>
      )}
      {!isNaN(latestRank) && latestRank.toString() !== "0" && (
        <>
          <div className="text-center inline-block text-xs">Last Rank: </div>
          <div className="text-center bg-light-orange inline-block p-1 mr-1 rounded-md text-xs">
            {latestRank}
          </div>
        </>
      )}
      <div className="grid-flow-col w-[300px] h-24">
        {isNaN(latestRank) && (
          <div className="flex items-center justify-center text-center h-24 animate-pulse font-semibold">
            Checking rank...
          </div>
        )}
        {!isNaN(latestRank) && latestRank.toString() !== "0" && (
          <Chart rankings={props.rankProps} chartWidth={300} />
        )}
      </div>
    </div>
  );
};

export default KeywordRow;
