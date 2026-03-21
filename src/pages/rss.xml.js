import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { filterDrafts, sortByDate } from '../utils/blog';

export async function GET(context) {
  const allPosts = await getCollection('blog');
  const posts = sortByDate(filterDrafts(allPosts));

  return rss({
    title: 'DevPulse — Developer Tech Blog',
    description: 'Deep dives into web development, DevOps, system design, and modern tooling.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Compute absolute link from the post slug
      link: `/blog/${post.id}/`,
      author: post.data.author,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: `<language>en-us</language>`,
  });
}
