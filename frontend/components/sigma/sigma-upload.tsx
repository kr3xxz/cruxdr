"use client";

import { useState } from "react";

export default function SigmaUpload() {

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const uploadRule = async () => {
    console.log("UPLOAD CLICKED");
    console.log("FILE =", file);
    if (!file) {
      alert("Select a Sigma rule first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://localhost:8080/sigma/upload",{method:"POST",body:formData});
    const data = await response.json();
    console.log(data);
    alert(`Uploaded: `);
    setStatus(`Uploaded: `);
  };

  return (

    <div className="bg-zinc-900 p-6 rounded-xl">

      <h2 className="text-white text-2xl font-bold mb-4">
        Sigma Rule Upload
      </h2>

      <input
        type="file"
        accept=".yml,.yaml"
        onChange={(e) => { const selected = e.target.files?.[0]; console.log("SELECTED FILE =", selected); setFile(selected || null); }}
        className="text-white"
      />

      <button
        onClick={uploadRule}
        className="ml-4 px-4 py-2 bg-cyan-600 text-white rounded"
      >
        Upload
      </button>

      <p className="text-green-400 mt-4 text-xl font-bold">
        {status}
      </p>

    </div>
  );
}
