// models/Article.ts
export interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }