import { getCollection } from 'astro:content';
import { filterDrafts, sortByDate } from '../utils/blog';

export async function GET() {
  const allPosts = await getCollection('blog');
  const posts = sortByDate(filterDrafts(allPosts));

  const index = posts.map(post => ({
    title: post.data.title,
    description: post.data.description,
    slug: post.id,
    tags: post.data.tags,
    category: post.data.category,
    date: post.data.pubDate,
  }));

  return new Response(JSON.stringify(index), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
