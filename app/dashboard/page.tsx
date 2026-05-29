import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

async function getResumeHistory() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/resume/history`, {
      cache: "no-store",
    });

  if (!res.ok) {
    return {
      totalResumes: 0,
      averageScore: 0,
      latestScore: 0,
      resumes: [],
    };
  }

  return res.json();
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getResumeHistory();

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-2">
        AI Resume Analyzer Dashboard
      </h1>

      <p className="text-gray-400 mb-8">Welcome, {user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">Total Resumes</p>
          <h2 className="text-4xl font-bold">{data.totalResumes}</h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">Average ATS Score</p>
          <h2 className="text-4xl font-bold">{data.averageScore}/100</h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">Latest Score</p>
          <h2 className="text-4xl font-bold">{data.latestScore}/100</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <a
          href="/upload"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          Analyze New Resume
        </a>

        <a
          href="/jobs"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
        >
          Job Tracker
        </a>

        <a
          href="/"
          className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold"
        >
          Home
        </a>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Analyses</h2>

      <div className="space-y-4">
        {data.resumes.length === 0 ? (
          <p className="text-gray-400">No resumes analyzed yet.</p>
        ) : (
          data.resumes.map((resume: any) => (
            <div
              key={resume.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex justify-between gap-4">
                <h3 className="font-bold">{resume.fileName}</h3>
                <span className="font-bold">{resume.atsScore}/100</span>
              </div>

              <p className="text-gray-400 mt-2">{resume.suggestions}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}