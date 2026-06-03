export type WritingPostMeta = {
  date: string;
  description: string;
  relatedWork: string[];
  slug: string;
  title: string;
};

export type WritingPost = WritingPostMeta & {
  content: string;
};
