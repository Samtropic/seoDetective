import Link from "next/link";
import React from "react";

interface DoubleHeaderProps {
  preTitle: string;
  mainTitle: string;
  preTitleLink?: string;
}

const DoubleHeader = ({
  preTitle,
  mainTitle,
  preTitleLink,
}: DoubleHeaderProps) => {
  return (
    <div>
      {preTitleLink && (
        <Link
          href={preTitleLink}
          className="block text-gray-300 text-lg uppercase"
        >
          {preTitle}
        </Link>
      )}
      {!preTitleLink && (
        <h3 className="block text-gray-300 text-lg uppercase">{preTitle}</h3>
      )}
      <h2 className="font-bold text-2xl mb-4 leading-5">{mainTitle}</h2>
    </div>
  );
};

export default DoubleHeader;
