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

        window.location.reload();

      } catch (err) {

        console.error(err);

        setStatus(
          "Upload failed"
        );
      }
    };

  return (

    <div className="bg-zinc-900 p-6 rounded-xl">

      <h2 className="text-white text-2xl font-bold mb-4">
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

      <button
        onClick={uploadRule}
        className="
          ml-4
          px-4
          py-2
          bg-cyan-600
          text-white
          rounded
        "
      >
        Upload
      </button>

      <p className="text-green-400 mt-4">
        {status}
      </p>

    </div>
  );
}
