export interface Passage {
  id: string;
  text: string;
  title: string;
  author: string;
  gutenbergId: number;
  wordCount: number;
  tags?: string[];
}

