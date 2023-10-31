import { IKeywordRankings } from "@/models/KeywordRanking";
import React from "react";
import { AreaChart, Tooltip, Area, ResponsiveContainer, YAxis } from "recharts";

interface ChartProps {
  rankings: Array<IKeywordRankings>;
  chartWidth: number;
}

function Chart({ rankings, chartWidth }: ChartProps) {
  const lowestRank = rankings.sort((a, b) => (a.rank < b.rank ? 1 : 0))?.[0]
    .rank;
  const highestRank = rankings.sort((a, b) => (a.rank > b.rank ? 1 : 0))?.[0]
    .rank;
  const domainLow = lowestRank + 3;

  const data = rankings
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : 0))
    .map((ranking) => ({
      date: ranking.createdAt,
      rank: ranking.rank,
      points: domainLow - ranking.rank,
    }));
  return (
    <div className="">
      <ResponsiveContainer height={100} width={chartWidth}>
        <AreaChart
          data={data}
          width={chartWidth}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <YAxis hide={true} domain={[0, lowestRank]} />
          <Tooltip
            labelFormatter={(active, payload) =>
              new Date(payload[0]?.payload.date).toLocaleDateString()
            }
            formatter={(value, name, props) => [
              "Rank: " + props?.payload?.rank,
            ]}
          />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
