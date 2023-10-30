"use client";
import axios from "axios";
import PQueue from "p-queue";
import React, { FormEvent, useState } from "react";

interface NewKeywordFormProps {
  onNew: () => void;
  domain: string;
}

const NewKeywordForm = ({ onNew, domain }: NewKeywordFormProps) => {
  const [keyword, setKeyword] = useState("");
  // create a new queue, and pass how many you want to scrape at once
  const queue = new PQueue({ concurrency: 1 });

  async function queuePostRanking(domain: string, keyword: string) {
    return queue.add(() => {
      axios.post("/api/rankings", {
        domain,
        keyword,
      });
    });
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setKeyword("");
    await axios.post("/api/keywords", {
      keyword,
      domain,
    });

    await queuePostRanking(domain, keyword);
    onNew();
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-8">
      <input
        value={keyword}
        onChange={(ev) => setKeyword(ev.target.value)}
        className="bg-white border border-b-4 border-orange-200 px-4 py-2 text-lg rounded-xl"
        type="text"
        placeholder="New Keyword"
      />
      <button
        type="submit"
        className="bg-orange-400 text-white px-8 rounded-xl border border-b-4 border-orange-600 hover:bg-dark-orange"
      >
        Add
      </button>
    </form>
  );
};

export default NewKeywordForm;
