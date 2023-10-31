"use client";
import Chart from "@/components/Chart";
import DeleteButton from "@/components/DeleteButton";
import DoubleHeader from "@/components/DoubleHeader";
import { IKeywordRankings } from "@/models/KeywordRanking";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const KeywordPage = (pageProps: PageProps) => {
  const keyword = decodeURIComponent(pageProps?.params.keyword);
  const domain = pageProps?.params.domain;
  const router = useRouter();
  const [rankings, setRankings] = useState([] as IKeywordRankings[]);

  useEffect(() => {
    axios
      .get("/api/keywords?keyword=" + keyword + "&domain=" + domain)
      .then((response) => {
        setRankings(response.data.ranks);
      });
  }, []);

  function deleteKeyword() {
    const urlParams =
      "?domain=" +
      encodeURIComponent(domain) +
      "&keyword=" +
      encodeURIComponent(keyword);
    const url = "/api/keywords" + urlParams;
    axios.delete(url).then(() => {
      router.push("/domains/" + domain);
    });
  }

  function showDeleteAlert() {
    MySwal.fire({
      title: <p>Delete keyword ?</p>,
      text: `Confirm suppression of the keyword ${keyword} ?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#FB923C",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      showCloseButton: true,
      focusCancel: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteKeyword();
      }
    });
  }

  return (
    <div>
      <div className="flex items-end mb-8">
        <DoubleHeader
          preTitle={domain + " »"}
          mainTitle={keyword}
          preTitleLink={`/domains/${domain}`}
        />
        <div className="p-2">
          <DeleteButton onClick={showDeleteAlert} />
        </div>
      </div>
      <div className="h-36 ">
        {rankings.length > 0 && rankings[0].rank !== 0 && (
          <Chart rankings={rankings} />
        )}
        {((rankings.length > 0 && rankings[0].rank === 0) ||
          rankings.length === 0) && (
          <div className="flex text-center justify-center items-center font-semibold">
            No rank registered
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordPage;
