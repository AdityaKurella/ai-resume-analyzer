"use client";

import { useEffect, useState } from "react";

export default function JobsPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);

  async function loadJobs() {
    const res = await fetch("/api/jobs/list");
    const data = await res.json();
    setJobs(data);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function addJob(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company, role, notes }),
    });

    if (res.ok) {
      setMessage("Job application saved successfully");
      setCompany("");
      setRole("");
      setNotes("");
      loadJobs();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Job Application Tracker
      </h1>

      <form
        onSubmit={addJob}
        className="max-w-xl bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <input
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700"
          placeholder="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700"
          placeholder="Role / Internship title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <textarea
          className="w-full mb-4 p-3 rounded-lg bg-gray-800 border border-gray-700"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold">
          Save Application
        </button>

        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Saved Applications
        </h2>

        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-gray-400">
              No job applications saved yet.
            </p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">
                      {job.company}
                    </h3>
                    <p className="text-gray-400">
                      {job.role}
                    </p>
                  </div>

                  <span className="bg-blue-600 px-3 py-1 rounded-lg h-fit">
                    {job.status}
                  </span>
                </div>

                {job.notes && (
                  <p className="mt-3 text-gray-300">
                    {job.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <a
        href="/dashboard"
        className="inline-block mt-6 text-blue-400 hover:underline"
      >
        Back to Dashboard
      </a>
    </main>
  );
}