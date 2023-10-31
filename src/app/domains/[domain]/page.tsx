"use client";
import React, { useEffect, useState } from "react";
import DoubleHeader from "@/components/DoubleHeader";
import NewKeywordForm from "@/components/NewKeywordForm";
import axios from "axios";
import { IKeyword } from "@/models/Keywords";
import KeywordRow from "@/components/KeywordRow";
import DeleteButton from "@/components/DeleteButton";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { IKeywordRankings } from "@/models/KeywordRanking";

const MySwal = withReactContent(Swal);

const DomainPage = (pageProps: PageProps) => {
  const domain = pageProps?.params.domain;
  const router = useRouter();
  const [keywords, setKeywords] = useState([] as IKeyword[]);
  const [ranks, setRanks] = useState([] as IKeywordRankings[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKeywords();
  }, []);

  function fetchKeywords() {
    setLoading(true);
    axios.get("/api/keywords?domain=" + domain).then((response) => {
      setKeywords(response.data.keywords);
      setRanks(response.data.ranks);
      setLoading(false);
    });
  }

  function deleteDomain() {
    axios.delete("/api/domains?domain=" + domain).then(() => {
      router.push("/");
    });
  }

  function showDeleteAlert() {
    MySwal.fire({
      title: <p>Delete domain ?</p>,
      text: `Do you want to permanently delete ${domain} ?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#FB923C",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
      focusCancel: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDomain();
      }
    });
  }

  return (
    <div>
      <div className="flex items-end">
        <DoubleHeader
          preTitle={"Domain »"}
          mainTitle={domain}
          preTitleLink="/"
        />
        <div className="p-2">
          <DeleteButton onClick={showDeleteAlert} />
        </div>
      </div>
      <NewKeywordForm domain={domain} onNew={fetchKeywords} />
      {loading && <div>Loading ...</div>}
      {!loading &&
        keywords.map((keywordDoc: IKeyword) => (
          <KeywordRow
            keywordProps={keywordDoc}
            key={keywordDoc._id}
            rankProps={ranks.filter((r) => r.keyword === keywordDoc.keyword)}
          />
        ))}
      {!loading && keywords.length == 0 && (
        <>
          <div className="grid place-items-center gap-4">
            <Image
              style={{ fill: "#FB293C" }}
              className=""
              src={"/assets/icons/put_in_box.svg"}
              alt="Add keyword"
              width={128}
              height={128}
            />
            <h3 className="font-bold text-xl">
              No keyword added yet, please add one
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default DomainPage;
