import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IKeyword } from "@/models/Keywords";
import { IDomain } from "@/models/Domains";

export interface DomainRowProps {
  domainProps: IDomain;
  keywords: Array<IKeyword>;
}

const DomainRow = ({ ...props }: DomainRowProps) => {
  return (
    <div className="flex items-center bg-white border border-orange-200 border-b-4 p-4 rounded-lg my-3 hover:bg-medium-orange">
      {props.domainProps.icon && (
        <Image
          className=""
          src={props.domainProps.icon}
          alt="domain 1 logo"
          width={50}
          height={50}
        />
      )}
      <div className="grow pl-3">
        <Link
          href={"/domains/" + props.domainProps.domain}
          className="font-bold text-lg leading-7 hover:text-white"
        >
          {props.domainProps.domain}
        </Link>
        <div>
          {props.keywords.map((keywdDoc) => (
            <Link
              key={props.domainProps.domain + keywdDoc.keyword}
              href={
                "/domains/" + props.domainProps.domain + "/" + keywdDoc.keyword
              }
              className="bg-light-orange inline-block p-1 mr-1 rounded-md text-xs hover:bg-dark-orange hover:text-white"
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
