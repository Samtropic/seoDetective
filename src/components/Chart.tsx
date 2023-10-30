import { IKeywordRankings } from "@/models/KeywordRanking";
import React from "react";
import { AreaChart, Tooltip, Area, ResponsiveContainer } from "recharts";

interface ChartProps {
  rankings: Array<IKeywordRankings>;
  chartWidth: number;
}

const data = [
  {
    date: "30-10-2023",
    rank: 4000,
  },
  {
    date: "31-10-2023",
    rank: 3000,
  },
  {
    date: "01-11-2023",
    rank: 6000,
  },
];

function Chart({ rankings, chartWidth }: ChartProps) {
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
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip formatter={(value, name, props) => value} />
          <Area
            type="monotone"
            dataKey="rank"
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
