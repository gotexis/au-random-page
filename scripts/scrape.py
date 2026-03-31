#!/usr/bin/env python3
"""Scrape Project Gutenberg books and slice into ~300 word passages."""
import json, os, re, urllib.request, time

# Books list — weighted toward 陛下's preferences: Philosophy, Psychology, History, Literature
# Format: (gutenberg_id, title, author, tags)
# PLANET-101 fix: corrected Gutenberg IDs (1656 was Plato's Apology, not Aristotle; 5827 was Russell not Nietzsche)
# PLANET-104 fix: corrected IDs for Descartes Discourse (59, not 13693) and Jekyll & Hyde (43, not 5740)
BOOKS = [
    # === PHILOSOPHY ===
    (1497, "The Republic", "Plato", ["philosophy", "politics", "classic"]),
    (8438, "The Nicomachean Ethics", "Aristotle", ["philosophy", "ethics", "classic"]),  # was 1656 (Plato's Apology)
    (3207, "Leviathan", "Thomas Hobbes", ["philosophy", "politics", "classic"]),
    (1232, "The Prince", "Niccolò Machiavelli", ["philosophy", "politics", "history"]),
    (4363, "Beyond Good and Evil", "Friedrich Nietzsche", ["philosophy", "classic"]),  # was mislabeled as Zarathustra
    (1998, "Thus Spoke Zarathustra", "Friedrich Nietzsche", ["philosophy", "literature"]),  # was 5827 (Russell)
    (1250, "Meditations", "Marcus Aurelius", ["philosophy", "stoicism", "history"]),
    (2680, "Meditations on First Philosophy", "René Descartes", ["philosophy", "classic"]),
    (4280, "The Critique of Pure Reason", "Immanuel Kant", ["philosophy", "classic"]),
    (30610, "The Art of War", "Sun Tzu", ["philosophy", "history", "strategy"]),
    (45615, "Tao Te Ching", "Lao Tzu", ["philosophy", "classic", "eastern"]),
    (2009, "The Analects", "Confucius", ["philosophy", "classic", "eastern"]),
    (59, "Discourse on the Method", "René Descartes", ["philosophy", "classic"]),  # was 13693 (404)
    (1321, "On Liberty", "John Stuart Mill", ["philosophy", "politics", "classic"]),

    # === PSYCHOLOGY / MIND ===
    (14969, "The Interpretation of Dreams", "Sigmund Freud", ["psychology", "classic"]),
    (19094, "Psychopathology of Everyday Life", "Sigmund Freud", ["psychology", "classic"]),
    (4705, "The Principles of Psychology Vol 1", "William James", ["psychology", "classic"]),
    (57697, "Man's Search for Meaning", "Viktor Frankl", ["psychology", "philosophy", "history"]),
    (2017, "Siddhartha", "Hermann Hesse", ["psychology", "philosophy", "literature"]),
    (43, "The Strange Case of Dr. Jekyll and Mr. Hyde", "Robert Louis Stevenson", ["psychology", "literature"]),  # was 5740 (404)

    # === HISTORY ===
    (2500, "The History of the Peloponnesian War", "Thucydides", ["history", "classic"]),
    (2591, "Parallel Lives", "Plutarch", ["history", "biography", "classic"]),
    (14840, "The Decline and Fall of the Roman Empire Vol 1", "Edward Gibbon", ["history", "classic"]),
    (2949, "Caesar's Gallic Wars", "Julius Caesar", ["history", "classic"]),
    (28054, "The Histories", "Herodotus", ["history", "classic"]),
    (18247, "The Autobiography of Benjamin Franklin", "Benjamin Franklin", ["history", "biography"]),
    (3600, "Democracy in America Vol 1", "Alexis de Tocqueville", ["history", "politics", "classic"]),
    (816, "Walden", "Henry David Thoreau", ["history", "philosophy", "nature"]),

    # === LITERATURE (classic) ===
    (2600, "War and Peace", "Leo Tolstoy", ["literature", "history", "classic"]),
    (996, "Don Quixote", "Miguel de Cervantes", ["literature", "classic"]),
    (2814, "Dubliners", "James Joyce", ["literature", "classic"]),
    (174, "The Picture of Dorian Gray", "Oscar Wilde", ["literature", "psychology"]),
    (5200, "Metamorphosis", "Franz Kafka", ["literature", "psychology"]),
    (219, "Heart of Darkness", "Joseph Conrad", ["literature", "history"]),
    (1727, "The Odyssey", "Homer", ["literature", "history", "classic"]),
    (6130, "The Iliad", "Homer", ["literature", "history", "classic"]),
    (84, "Frankenstein", "Mary Shelley", ["literature", "philosophy"]),
    (1342, "Pride and Prejudice", "Jane Austen", ["literature", "classic"]),
    (98, "A Tale of Two Cities", "Charles Dickens", ["literature", "history"]),
    (1400, "Great Expectations", "Charles Dickens", ["literature", "classic"]),
    (768, "Wuthering Heights", "Emily Brontë", ["literature", "classic"]),
    (1260, "Jane Eyre", "Charlotte Brontë", ["literature", "classic"]),
    (1661, "The Adventures of Sherlock Holmes", "Arthur Conan Doyle", ["literature", "mystery"]),
    (2701, "Moby Dick", "Herman Melville", ["literature", "philosophy"]),
    (1184, "The Count of Monte Cristo", "Alexandre Dumas", ["literature", "history"]),
    (345, "Dracula", "Bram Stoker", ["literature", "classic"]),
    (35, "The Time Machine", "H.G. Wells", ["literature", "science"]),
    (36, "The War of the Worlds", "H.G. Wells", ["literature", "science"]),
]

# Deduplicate by gutenberg_id (keep first occurrence)
seen = set()
BOOKS_DEDUPED = []
for entry in BOOKS:
    if entry[0] not in seen:
        seen.add(entry[0])
        BOOKS_DEDUPED.append(entry)
BOOKS = BOOKS_DEDUPED


def fetch_text(book_id):
    url = f"https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.txt"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "RandomPage/1.0 (scraper for educational site)"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"  FAIL {book_id}: {e}")
        return None


def strip_gutenberg_header_footer(text):
    """
    PLANET-100 fix: normalize line endings first so regex reliably matches.
    The START/END markers are on a single line but \r\n endings could interfere.
    Also added re.IGNORECASE for robustness.
    """
    # Normalize Windows line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    start = re.search(r'\*\*\*\s*START OF.*?\*\*\*', text, re.IGNORECASE)
    end = re.search(r'\*\*\*\s*END OF.*?\*\*\*', text, re.IGNORECASE)
    if start:
        text = text[start.end():]
    if end:
        text = text[:end.start()]
    return text.strip()


def slice_passages(text, words_per_passage=280):
    """
    PLANET-102 fix: text.split('\n\n') fails when line endings are \r\n.
    Normalize before splitting. Also filter very short paragraphs.
    """
    # Normalize line endings (belt and suspenders — strip_gutenberg already does this,
    # but slice_passages may be called independently)
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip() and len(p.strip()) > 50]
    passages = []
    current = []
    word_count = 0
    for p in paragraphs:
        p_words = len(p.split())
        if word_count + p_words > words_per_passage and current:
            passages.append('\n\n'.join(current))
            current = [p]
            word_count = p_words
        else:
            current.append(p)
            word_count += p_words
    if current:
        passages.append('\n\n'.join(current))
    return passages


def cap_passage(text, max_words=350):
    """
    PLANET-103 fix: replace character cap (text[:1500]) with word-count cap (~350 words).
    1500 chars ≈ 200 words which truncates mid-sentence. 350 words ≈ 2100 chars.
    Truncate at the last sentence boundary within max_words.
    """
    words = text.split()
    if len(words) <= max_words:
        return text
    # Truncate to max_words then find last sentence-ending punctuation
    truncated = ' '.join(words[:max_words])
    # Find last sentence end (. ! ?)
    last_end = max(truncated.rfind('.'), truncated.rfind('!'), truncated.rfind('?'))
    if last_end > len(truncated) // 2:
        return truncated[:last_end + 1]
    return truncated


def main():
    all_passages = []
    for entry in BOOKS:
        book_id, title, author = entry[0], entry[1], entry[2]
        tags = entry[3] if len(entry) > 3 else []
        print(f"Fetching: {title} ({book_id})...")
        text = fetch_text(book_id)
        if not text:
            continue
        text = strip_gutenberg_header_footer(text)
        passages = slice_passages(text)
        # Take up to 30 passages per book (evenly spaced)
        if len(passages) > 30:
            step = len(passages) // 30
            passages = passages[::step][:30]
        for i, p in enumerate(passages):
            capped = cap_passage(p)  # PLANET-103: word-count cap instead of char cap
            all_passages.append({
                "id": f"g{book_id}-{i}",
                "text": capped,
                "title": title,
                "author": author,
                "gutenbergId": book_id,
                "wordCount": len(capped.split()),
                "tags": tags,
            })
        print(f"  -> {len(passages)} passages")
        time.sleep(1)  # be nice

    out_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'passages.json')
    with open(out_path, 'w') as f:
        json.dump(all_passages, f, ensure_ascii=False, indent=2)
    # Print stats by category
    from collections import Counter
    tag_counts = Counter(t for p in all_passages for t in p.get('tags', []))
    print(f"\nTotal: {len(all_passages)} passages written to {out_path}")
    print("Tag distribution:", dict(tag_counts.most_common()))


if __name__ == '__main__':
    main()
