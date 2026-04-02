"use client";

import { useState, useCallback, useEffect } from "react";
import type { Passage } from "@/types";
import passages from "@/data/passages.json";
import { useHistory } from "@/hooks/useHistory";

function getRandomPassage(): Passage {
  return passages[Math.floor(Math.random() * passages.length)] as Passage;
}

export default function Home() {
  const [passage, setPassage] = useState<Passage>(() => getRandomPassage());
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToHistory } = useHistory();

  // Record the initial passage
  useEffect(() => {
    addToHistory(passage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewPassage = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      const next = getRandomPassage();
      setPassage(next);
      addToHistory(next);
      setIsAnimating(false);
    }, 300);
  }, [addToHistory]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">📖 RandomPage</h1>
        <p className="text-base-content/70 text-lg">
          Discover classic literature, one passage at a time
        </p>
      </div>

      <div
        className={`card bg-base-200 shadow-xl transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="card-body">
          <div className="prose prose-lg max-w-none">
            {passage.text.split("\n\n").map((para, i) => (
              <p key={i} className="leading-relaxed text-base-content/90">
                {para}
              </p>
            ))}
          </div>
          <div className="divider" />
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <p className="font-semibold text-primary">{passage.title}</p>
              <p className="text-sm text-base-content/60">
                by {passage.author} · {passage.wordCount} words
              </p>
              {passage.tags && passage.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {passage.tags.map((tag) => (
                    <span key={tag} className="badge badge-outline badge-sm capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <a
              href={`https://www.gutenberg.org/ebooks/${passage.gutenbergId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
            >
              Read Full Book →
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button className="btn btn-primary btn-lg" onClick={handleNewPassage}>
          🎲 Another Passage
        </button>
      </div>

      <div className="mt-12 text-center text-base-content/50 text-sm">
        <p>
          {passages.length} passages from {new Set(passages.map((p) => (p as Passage).title)).size} classic books
        </p>
        <p>All texts sourced from Project Gutenberg (public domain)</p>
      </div>
    </div>
  );
}
