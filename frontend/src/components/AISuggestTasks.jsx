import { useState } from "react";
import API from "../lib/api";

const PRIORITY_STYLES = {
  High:   "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Low:    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const AISuggestTasks = ({ projectId, projectName, projectDescription, onTasksCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setSelected([]);
    setIsOpen(true);

    try {
      const res = await API.post('/ai/suggest-tasks', {
        projectName,
        projectDescription,
      });
      setSuggestions(res.data.tasks);
      // Select all by default
      setSelected(res.data.tasks.map((_, i) => i));
    } catch (err) {
      console.error('AI suggestion error:', err);
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddTasks = async () => {
    if (selected.length === 0) return;
    setCreating(true);

    try {
      const tasksToCreate = selected.map((i) => suggestions[i]);

      const created = await Promise.all(
        tasksToCreate.map((task) =>
          API.post('/tasks', {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            projectId,
          })
        )
      );

      if (onTasksCreated) {
        onTasksCreated(created.map((r) => r.data));
      }

      setIsOpen(false);
      setSuggestions([]);
      setSelected([]);
    } catch (err) {
      console.error('Error creating tasks:', err);
      setError('Failed to create some tasks. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={fetchSuggestions}
        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700
          text-white text-sm font-semibold rounded-lg transition-colors"
      >
        🤖 Suggest Tasks with AI
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  🤖 AI Task Suggestions
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Based on: <span className="font-medium">{projectName}</span>
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
            <div className="flex-1 overflow-y-auto p-5">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI is generating tasks...
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700
                  rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {!loading && suggestions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                    {selected.length} of {suggestions.length} tasks selected
                  </p>

                  {suggestions.map((task, i) => (
                    <div
                      key={i}
                      onClick={() => toggleSelect(i)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selected.includes(i)
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          selected.includes(i)
                            ? 'bg-violet-600 border-violet-600'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selected.includes(i) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>

                        {/* Task info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                              {task.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              PRIORITY_STYLES[task.priority] ?? 'bg-gray-100 text-gray-600'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!loading && suggestions.length > 0 && (
              <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <button
                  onClick={() => setSelected(suggestions.map((_, i) => i))}
                  className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Select all
                </button>
                <button
                  onClick={() => setSelected([])}
                  className="text-sm text-gray-400 hover:underline"
                >
                  Deselect all
                </button>
                <button
                  onClick={handleAddTasks}
                  disabled={selected.length === 0 || creating}
                  className="ml-auto px-5 py-2 bg-violet-600 hover:bg-violet-700
                    disabled:opacity-50 text-white text-sm font-semibold
                    rounded-lg transition-colors"
                >
                  {creating ? 'Adding...' : `Add ${selected.length} Task${selected.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AISuggestTasks;