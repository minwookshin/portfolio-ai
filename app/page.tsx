import HomePage from "@/components/HomePage";
import { getLatestWritingPosts } from "@/lib/writing";

export default function Page() {
  const latestWritingPosts = getLatestWritingPosts(2);

  return <HomePage latestWritingPosts={latestWritingPosts} />;
}
