import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { remarkCodeMeta } from "./src/lib/remark-code-meta";

const posts = defineCollection({
    name: "posts",
    directory: "content/blog",
    include: "**/*.mdx",
    schema: z.object({
        title: z.string(),
        publishedAt: z.string(),
        updatedAt: z.string().optional(),
        author: z.string().optional(),
        summary: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
    }),
    transform: async (document, context) => {
        const mdx = await compileMDX(context, document, {
            remarkPlugins: [remarkGfm, remarkCodeMeta],
        });
        return {
            ...document,
            mdx,
        };
    },
});

const projects = defineCollection({
    name: "projects",
    directory: "content/projects",
    include: "**/*.mdx",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(["web-app", "website", "open-source", "other"]),
        techStack: z.array(z.string()),
        featured: z.boolean().default(false),
        coverImage: z.string().optional(),
        githubUrl: z.string().optional(),
        liveUrl: z.string().optional(),
        publishedAt: z.string(),
    }),
    transform: async (document, context) => {
        const mdx = await compileMDX(context, document, {
            remarkPlugins: [remarkGfm, remarkCodeMeta],
        });
        return {
            ...document,
            mdx,
        };
    },
});

export default defineConfig({
    collections: [posts, projects],
});
