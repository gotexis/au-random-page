import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About RandomPage — how it works and where the data comes from",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto prose prose-lg">
      <h1>About RandomPage</h1>
      <p>
        RandomPage helps you discover classic literature through bite-sized passages.
        Every time you press the button, you get a fresh excerpt from one of 40+ classic books.
      </p>

      <h2>How It Works</h2>
      <ol>
        <li>We source full texts from <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer">Project Gutenberg</a>, a library of 70,000+ free public domain books.</li>
        <li>Each book is sliced into passages of roughly 250–300 words — about one page.</li>
        <li>When you hit &quot;Another Passage&quot;, one is chosen at random from the entire collection.</li>
      </ol>

      <h2>Why Passages?</h2>
      <p>
        In an age of short attention spans, full novels can feel daunting. A single page gives you 
        the flavour of a book — its style, its voice, its world — in under two minutes. If it hooks 
        you, the &quot;Read Full Book&quot; link takes you straight to the complete text.
      </p>

      <h2>Copyright</h2>
      <p>
        All passages are from books in the <strong>public domain</strong>. They are free to read, 
        share, and enjoy. Project Gutenberg has been digitising public domain works since 1971.
      </p>

      <h2>Data Source</h2>
      <p>
        Texts are downloaded from Project Gutenberg&apos;s plain-text archive. No copyrighted material 
        is included. Each passage is approximately one page (250–300 words), well within fair use 
        guidelines even if copyright were applicable.
      </p>
    </div>
  );
}
