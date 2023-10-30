"use client";
import DomainRow, { DomainRowProps } from "@/components/DomainRow";
import DoubleHeader from "@/components/DoubleHeader";
import { IKeyword } from "@/models/Keywords";

export interface DomainsListProps {
  domains: Array<DomainRowProps>;
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
      {domains.map((domainDoc: DomainRowProps) => (
        <DomainRow
          {...(domainDoc as DomainRowProps)}
          keywords={keywords.filter((k) => k.domain === domainDoc.domain)}
        />
      ))}
    </div>
  );
};

export default DomainsList;
