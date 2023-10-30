"use client";
import axios from "axios";
import React, { FormEvent, useState } from "react";

interface NewDomainFormProps {
  onNew: () => void;
}

const isValidURL = (input: string): string | null => {
  try {
    const parsedURL = new URL(input);
    return parsedURL.hostname;
  } catch (error) {
    try {
      // Attempt to create a URL with a dummy protocol and the provided hostname
      const parsedURL = new URL(`http://${input}`);
      return parsedURL.hostname;
    } catch (error) {
      return null;
    }
  }
};

const NewDomainForm = ({ onNew }: NewDomainFormProps) => {
  const [domain, setDomain] = useState("");

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const isValidLink = isValidURL(domain);
    if (!isValidLink) {
      alert("Please type a valid url !");
    } else {
      setDomain("");
      await axios.post("/api/domains", { domain });
      onNew();
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-8">
      <input
        value={domain}
        onChange={(ev) => setDomain(ev.target.value)}
        className="bg-white border border-b-4 border-orange-200 px-4 py-2 text-lg rounded-xl"
        type="text"
        placeholder="NewDomain.com"
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

export default NewDomainForm;
