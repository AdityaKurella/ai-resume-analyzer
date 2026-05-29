export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-6">
          AI Resume Analyzer
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Analyze your resume, get ATS score, find weaknesses, and improve your chances of getting shortlisted.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}