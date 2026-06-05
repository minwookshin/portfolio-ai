import HomePage from "@/components/HomePage";
import { getWritingPosts } from "@/lib/writing";

export default function Page() {
  const writingPosts = getWritingPosts();

  return <HomePage activeSection="work" writingPosts={writingPosts} />;
}
