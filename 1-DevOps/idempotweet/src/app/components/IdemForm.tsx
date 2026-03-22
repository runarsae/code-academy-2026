"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface PublishResponse {
  success?: boolean;
  error?: string;
  message?: string;
  id?: string;
}

export function IdemForm() {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author: author.trim(), content: content.trim() }),
      });

      const data: PublishResponse = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to publish idem");
        return;
      }

      setSuccess("Idem published! It will appear in the feed once processed.");
      setAuthor("");
      setContent("");

      // Invalidate and refetch after a short delay to allow consumer to process
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["idems"] });
      }, 1000);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Idem</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1">
          Author
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          placeholder="Your name"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
        <p className="mt-1 text-xs text-slate-500">{author.length}/50 characters</p>
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          required
        />
        <p className="mt-1 text-xs text-slate-500">{content.length}/280 characters</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !author.trim() || !content.trim()}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Publishing..." : "Publish Idem"}
      </button>

      <p className="mt-3 text-xs text-slate-500 text-center">
        Your idem will be sent to the event queue and processed by a consumer.
      </p>
    </form>
  );
}
