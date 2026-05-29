import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalResumes = resumes.length;

  const averageScore =
    totalResumes > 0
      ? Math.round(
          resumes.reduce((sum, resume) => sum + resume.atsScore, 0) /
            totalResumes
        )
      : 0;

  const latestScore = resumes[0]?.atsScore || 0;

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-2">
        AI Resume Analyzer Dashboard
      </h1>

      <p className="text-gray-400 mb-8">Welcome, {user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">Total Resumes</p>
          <h2 className="text-4xl font-bold">{totalResumes}</h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">Average ATS Score</p>
          <h2 className="text-4xl font-bold">{averageScore}/100</h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400">Latest Score</p>
          <h2 className="text-4xl font-bold">{latestScore}/100</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <a href="/upload" className="bg-blue-600 px-6 py-3 rounded-lg font-semibold">
          Analyze New Resume
        </a>

        <a href="/jobs" className="bg-green-600 px-6 py-3 rounded-lg font-semibold">
          Job Tracker
        </a>

        <a href="/" className="bg-gray-800 px-6 py-3 rounded-lg font-semibold">
          Home
        </a>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Analyses</h2>

      <div className="space-y-4">
        {resumes.length === 0 ? (
          <p className="text-gray-400">No resumes analyzed yet.</p>
        ) : (
          resumes.map((resume) => (
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