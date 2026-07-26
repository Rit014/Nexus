import { useState } from "react";
import API from "../lib/api";

const AIProjectSummary = ({ projectId, projectName, projectDescription, tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setSummary(null);
    setStats(null);

    try {
      const res = await API.post('/ai/summarize-project', {
        projectName,
        projectDescription,
        tasks,
      });
      setSummary(res.data.summary);
      setStats(res.data.stats);
    } catch (err) {
      console.error('AI summary error:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={fetchSummary}
        className="flex items-center gap-2 px-4 py-2
          bg-emerald-600 hover:bg-emerald-700
          text-white text-sm font-semibold rounded-lg transition-colors"
      >
        🤖 Summarize Project
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            rounded-2xl shadow-xl w-full max-w-lg">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  🤖 AI Project Summary
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {projectName}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI is analyzing your project...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700
                  rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {!loading && stats && (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                        Overall Progress
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {stats.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats pills */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      📋 Total: {stats.total}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      ✅ Done: {stats.completed}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                      ⏳ In Progress: {stats.inProgress}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                      📌 To-Do: {stats.todo}
                    </span>
                  </div>

                  {/* AI Summary */}
                  {summary && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                        🤖 AI Analysis
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {summary}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!loading && (
              <div className="px-5 pb-5 flex justify-between items-center">
                <button
                  onClick={fetchSummary}
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  🔄 Regenerate
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200
                    dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300
                    text-sm font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIProjectSummary;