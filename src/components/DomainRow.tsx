import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IKeyword } from "@/models/Keywords";

export interface DomainRowProps {
  owner: string;
  domain: string;
  icon: string;
  keywords: Array<IKeyword>;
}

const DomainRow = ({ domain, icon, keywords }: DomainRowProps) => {
  return (
    <div className="flex items-center bg-white border border-orange-200 border-b-4 p-4 rounded-lg my-3 hover:bg-medium-orange">
      {icon && (
        <Image
          className=""
          src={icon}
          alt="domain 1 logo"
          width={50}
          height={50}
        />
      )}
      <div className="grow pl-3">
        <Link
          href={"/domains/" + domain}
          className="font-bold text-lg leading-7 hover:text-white"
        >
          {domain}
        </Link>
        <div>
          {keywords.map((keywdDoc) => (
            <Link
              href={"/domains/" + domain + "/" + keywdDoc.keyword}
              className="bg-orange-100 inline-block p-1 mr-1 rounded-md text-xs hover:bg-dark-orange hover:text-white"
            >
              {keywdDoc.keyword}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="bg-green-100 w-36 h-24"></div>
      </div>
    </div>
  );
};

export default DomainRow;
