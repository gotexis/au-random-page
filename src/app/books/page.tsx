import type { Metadata } from "next";
import passages from "@/data/passages.json";
import type { Passage } from "@/types";

export const metadata: Metadata = {
  title: "Browse Books",
  description: "Browse all classic books available on RandomPage",
};

export default function BooksPage() {
  const books = new Map<string, { title: string; author: string; gutenbergId: number; count: number }>();
  for (const p of passages as Passage[]) {
    if (!books.has(p.title)) {
      books.set(p.title, { title: p.title, author: p.author, gutenbergId: p.gutenbergId, count: 0 });
    }
    books.get(p.title)!.count++;
  }
  const bookList = Array.from(books.values()).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📚 Browse Books</h1>
      <p className="mb-8 text-base-content/70">
        {bookList.length} classic books with {passages.length} passages available.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookList.map((book) => (
          <div key={book.gutenbergId} className="card bg-base-200 shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-base">{book.title}</h2>
              <p className="text-sm text-base-content/60">{book.author}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="badge badge-primary badge-sm">{book.count} passages</span>
                <a
                  href={`https://www.gutenberg.org/ebooks/${book.gutenbergId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link text-sm"
                >
                  Gutenberg →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
