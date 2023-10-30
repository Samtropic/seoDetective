"use client";
import DeleteButton from "@/components/DeleteButton";
import DoubleHeader from "@/components/DoubleHeader";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const KeywordPage = (pageProps: PageProps) => {
  const keyword = decodeURIComponent(pageProps?.params.keyword);
  const domain = pageProps?.params.domain;
  const router = useRouter();

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
      <div className="bg-green-200 h-36 "></div>
    </div>
  );
};

export default KeywordPage;
