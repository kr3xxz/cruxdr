"use client";

import { useState } from "react";

export default function SigmaUpload() {

  const [file, setFile] =
    useState<File | null>(null);

  const [status, setStatus] =
    useState("");

  const uploadRule =
    async () => {

      if (!file) {

        alert(
          "Select a Sigma rule first"
        );

        return;
      }

      try {

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            "http://localhost:8050/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        setStatus(
          `Uploaded: ${data.file}`
        );

        setTimeout(
          () => window.location.reload(),
          1000
        );

      } catch (err) {

        console.error(err);

        setStatus(
          "Upload failed"
        );
      }
    };

  const clearRules =
    async () => {

      const confirmed =
        confirm(
          "Delete ALL Sigma rules?"
        );

      if (!confirmed)
        return;

      try {

        const response =
          await fetch(
            "http://localhost:8050/rules",
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        setStatus(
          data.message
        );

        setTimeout(
          () => window.location.reload(),
          1000
        );

      } catch (err) {

        console.error(err);

        setStatus(
          "Failed to clear rules"
        );
      }
    };

  return (

    <div
      className="
        bg-zinc-900
        p-6
        rounded-xl
      "
    >

      <h2
        className="
          text-white
          text-2xl
          font-bold
          mb-4
        "
      >
        Sigma Rule Upload
      </h2>

      <input
        type="file"
        accept=".yaml,.yml"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ||
            null
          )
        }
        className="text-white"
      />

      <div
        className="
          flex
          gap-3
          mt-4
        "
      >

        <button
          onClick={uploadRule}
          className="
            px-4
            py-2
            bg-cyan-600
            text-white
            rounded
          "
        >
          Upload
        </button>

        <button
          onClick={clearRules}
          className="
            px-4
            py-2
            bg-red-600
            text-white
            rounded
          "
        >
          Clear Rules
        </button>

      </div>

      <p
        className="
          text-green-400
          mt-4
        "
      >
        {status}
      </p>

    </div>
  );
}
