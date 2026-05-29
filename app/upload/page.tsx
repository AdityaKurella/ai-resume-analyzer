"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [manualContent, setManualContent] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function uploadPdfResume() {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/resume/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setResult(data.resume);
    } else {
      alert(data.message);
    }
  }

  async function analyzeManualResume() {
    if (!manualContent.trim()) {
      alert("Please paste resume text");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/resume/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: "manual-resume.txt",
        content: manualContent,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setResult(data.resume);
    } else {
      alert(data.message);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-2">Upload Resume</h1>

      <p className="text-gray-400 mb-8">
        Upload a PDF resume or paste resume text manually.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">PDF Upload</h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 block w-full text-gray-300"
          />

          <button
            onClick={uploadPdfResume}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Upload & Analyze PDF"}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Manual Text</h2>

          <textarea
            className="w-full h-48 bg-gray-800 border border-gray-700 rounded-xl p-4"
            placeholder="Paste your resume text here..."
            value={manualContent}
            onChange={(e) => setManualContent(e.target.value)}
          />

          <button
            onClick={analyzeManualResume}
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            ATS Score: {result.atsScore}/100
          </h2>

          <p className="mb-3">
            <b>File:</b> {result.fileName}
          </p>

          <p className="mb-3">
            <b>Summary:</b> {result.summary}
          </p>

          <p className="mb-3">
            <b>Strengths:</b> {result.strengths}
          </p>

          <p className="mb-3">
            <b>Weaknesses:</b> {result.weaknesses}
          </p>

          <p>
            <b>Suggestions:</b> {result.suggestions}
          </p>
        </div>
      )}

      <a
        href="/dashboard"
        className="inline-block mt-8 text-blue-400 hover:underline"
      >
        Back to Dashboard
      </a>
    </main>
  );
}