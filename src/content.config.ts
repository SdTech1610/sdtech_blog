import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title:        z.string(),
    description:  z.string(),
    pubDate:      z.coerce.date(),
    updatedDate:  z.coerce.date().optional(),
    author:       z.string().default('DevPulse Team'),
    authorBio:    z.string().optional(),
    authorAvatar: z.string().optional(),
    heroImage:    z.string().optional(),
    heroAlt:      z.string().optional(),  
    tags:         z.array(z.string()).default([]),
    category:     z.string().default('General'),
    featured:     z.boolean().default(false),
    draft:        z.boolean().default(false).optional(),
    showPromo:    z.boolean().default(false),
    readingTime:  z.number().optional(),
    seoTitle:     z.string().optional(),
    seoDescription:z.string().optional(),
    canonicalURL: z.string().url().optional(),
    relatedPosts: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
