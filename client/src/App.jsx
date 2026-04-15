import { useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Moon,
  Sun,
  BarChart,
} from "lucide-react";

export default function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const API = "http://localhost:5000/analyze";

  const handleSubmit = async () => {
    if (!resume || jd.trim() === "") {
      alert("Upload resume & enter JD");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);

    try {
      setLoading(true);

      const res = await axios.post(API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (score) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">

        {/* HEADER */}
        <div className="bg-white dark:bg-gray-800 border-b px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <BarChart size={22} /> AI Resume Analyzer
          </h1>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* MAIN */}
        <div className="max-w-6xl mx-auto mt-8 px-4 grid md:grid-cols-2 gap-6">

          {/* LEFT PANEL */}
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm transition hover:shadow-md">

            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Upload size={18} /> Upload Resume
            </h2>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
            />

            {resume && (
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <FileText size={14} /> {resume.name}
              </p>
            )}

            <textarea
              placeholder="Paste Job Description..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full mt-4 p-3 border rounded focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700 dark:text-white"
              rows={6}
            />

            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition transform hover:scale-[1.02]"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm transition hover:shadow-md">

            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Analysis Results
            </h2>

            {!result ? (
              <div className="text-gray-400 text-center mt-10 animate-pulse">
                No analysis yet
              </div>
            ) : (
              <div className="animate-fadeIn">
                {/* SCORE */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-2xl font-bold">
                    {result.score}%
                  </p>

                  <div className="w-full bg-gray-200 rounded h-3 mt-2">
                    <div
                      className={`h-3 rounded ${getColor(result.score)}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>

                {/* MATCHED */}
                <div className="mb-4">
                  <h3 className="text-green-600 font-semibold">
                    Matched Skills
                  </h3>
                  <ul className="list-disc ml-5 text-sm mt-1">
                    {result.matched.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* MISSING */}
                <div className="mb-4">
                  <h3 className="text-red-600 font-semibold">
                    Missing Skills
                  </h3>
                  <ul className="list-disc ml-5 text-sm mt-1">
                    {result.missing.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* SUGGESTIONS */}
                <div>
                  <h3 className="text-purple-600 font-semibold">
                    Suggestions
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 border p-3 rounded text-sm mt-2 whitespace-pre-wrap">
                    {result.suggestions}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}