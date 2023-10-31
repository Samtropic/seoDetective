"use client";
import DomainRow, { DomainRowProps } from "@/components/DomainRow";
import DoubleHeader from "@/components/DoubleHeader";
import { IDomain } from "@/models/Domains";
import { IKeyword } from "@/models/Keywords";

export interface DomainsListProps {
  domains: Array<IDomain>;
  keywords: Array<IKeyword>;
}

const DomainsList = ({ domains, keywords }: DomainsListProps) => {
  return (
    <div>
      <DoubleHeader
        preTitle="Your domains"
        mainTitle={
          domains.length > 1
            ? domains.length + " domains"
            : domains.length + " domain"
        }
      />
      {domains.map((domainDoc: IDomain) => (
        <DomainRow
          domainProps={domainDoc}
          key={domainDoc._id}
          keywords={keywords.filter((k) => k.domain === domainDoc.domain)}
        />
      ))}
    </div>
  );
};

export default DomainsList;
