import type { CollectionEntry } from 'astro:content';

/** Sort posts by publish date descending */
export function sortByDate(posts: CollectionEntry<'blog'>[]) {
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Filter out draft posts */
export function filterDrafts(posts: CollectionEntry<'blog'>[]) {
  return posts.filter(p => !p.data.draft);
}

/** Get all unique tags from posts */
export function getAllTags(posts: CollectionEntry<'blog'>[]): Map<string, number> {
  const tagCounts = new Map<string, number>();
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });
  return new Map([...tagCounts.entries()].sort((a, b) => b[1] - a[1]));
}

/** Get all unique categories */
export function getAllCategories(posts: CollectionEntry<'blog'>[]): Map<string, number> {
  const catCounts = new Map<string, number>();
  posts.forEach(post => {
    const cat = post.data.category;
    catCounts.set(cat, (catCounts.get(cat) ?? 0) + 1);
  });
  return new Map([...catCounts.entries()].sort((a, b) => b[1] - a[1]));
}

/** Get related posts based on shared tags */
export function getRelatedPosts(
  post: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit = 3,
): CollectionEntry<'blog'>[] {
  const others = filterDrafts(allPosts).filter(p => p.id !== post.id);
  const scores = others.map(other => {
    const sharedTags = post.data.tags.filter(t => other.data.tags.includes(t)).length;
    const sameCategory = post.data.category === other.data.category ? 1 : 0;
    return { post: other, score: sharedTags * 2 + sameCategory };
  });
  return scores
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map(s => s.post);
}

/** Estimate reading time from raw content */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/** Format date as "March 16, 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format date as short "Mar 16, 2026" */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Convert tag to URL-friendly slug */
export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Slugify any string */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

/** Paginate an array */
export function paginate<T>(array: T[], page: number, perPage: number): { items: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(array.length / perPage);
  const items = array.slice((page - 1) * perPage, page * perPage);
  return { items, totalPages, currentPage: page };
}

/** Pick tag colour class based on tag hash */
export function tagColor(tag: string): string {
  const colors = [
    'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  ];
  let hash = 0;
  for (const c of tag) hash = (hash * 31 + c.charCodeAt(0)) & 0xfffff;
  return colors[Math.abs(hash) % colors.length];
}
