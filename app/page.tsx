import HomePage from "@/components/HomePage";
import StructuredData from "@/components/StructuredData";
import { profilePageJsonLd } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";

export default function Page() {
  const writingPosts = getWritingPosts();

  return (
    <>
      <StructuredData data={profilePageJsonLd()} />
      <HomePage activeSection="work" writingPosts={writingPosts} />
    </>
  );
}
