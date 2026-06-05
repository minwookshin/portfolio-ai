import HomePage from "@/components/HomePage";
import { getWritingPosts } from "@/lib/writing";

const HOME_WRITING_PREVIEW_LIMIT = 6;

export default function Page() {
  const writingPosts = getWritingPosts();
  const latestWritingPosts = writingPosts.slice(0, HOME_WRITING_PREVIEW_LIMIT);

  return <HomePage latestWritingPosts={latestWritingPosts} showAllWritingLink={writingPosts.length > HOME_WRITING_PREVIEW_LIMIT} />;
}
