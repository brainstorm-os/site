import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { Platform, ReleaseChannel } from "~/content/releases";

const apps = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/apps" }),
	schema: z.object({
		order: z.number().int().positive(),
		name: z.string(),
		appId: z.string().startsWith("io.brainstorm."),
		tagline: z.string().max(72),
		summary: z.string().min(20),
		capabilities: z.array(z.string().min(10)).min(3).max(8),
		screenshots: z
			.array(
				z.object({
					src: z.string().startsWith("/screenshots/apps/"),
					title: z.string(),
					caption: z.string().min(20),
				}),
			)
			.min(1),
		source: z.string(),
	}),
});

const capabilities = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/capabilities" }),
	schema: z.object({
		order: z.number().int().positive(),
		title: z.string(),
		summary: z.string().min(20),
		linkHref: z.string().url(),
		linkLabel: z.string(),
		source: z.string(),
	}),
});

const changelog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/changelog" }),
	schema: z.object({
		date: z.coerce.date(),
		version: z.string(),
		title: z.string(),
		summary: z.string().min(20),
		highlights: z.array(z.string()).optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: z.object({
		date: z.coerce.date(),
		title: z.string(),
		summary: z.string().min(20),
		kind: z.enum(["decision", "retrospective", "advisory", "tutorial"]),
		tags: z.array(z.string()).default([]),
		author: z.string().default("Brainstorm team"),
		source: z.string().optional(),
	}),
});

const tutorials = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/tutorials" }),
	schema: z.object({
		order: z.number().int().positive(),
		title: z.string(),
		summary: z.string().min(20),
		duration: z.string(),
		audience: z.enum(["general", "developer", "power-user"]),
		status: z.enum(["draft", "published"]).default("draft"),
	}),
});

const segments = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/segments" }),
	schema: z.object({
		order: z.number().int().positive(),
		audience: z.string(),
		headline: z.string(),
		summary: z.string().min(20),
		proof: z.string().optional(),
		channels: z.array(z.string()).default([]),
		source: z.string(),
	}),
});

const compare = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/compare" }),
	schema: z.object({
		competitor: z.string(),
		competitorTagline: z.string(),
		status: z.enum(["draft", "published"]).default("draft"),
		competitorURL: z.string().url().optional(),
		summary: z.string().min(20),
		matrix: z.array(
			z.object({
				axis: z.string(),
				brainstorm: z.string(),
				competitor: z.string(),
			}),
		),
		source: z.string(),
	}),
});

const releases = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/releases" }),
	schema: z.object({
		date: z.coerce.date(),
		version: z.string(),
		channel: z.enum([ReleaseChannel.Stable, ReleaseChannel.Beta]).default(ReleaseChannel.Stable),
		status: z.enum(["draft", "published"]).default("published"),
		summary: z.string().min(20),
		highlights: z.array(z.string()).default([]),
		assets: z
			.array(
				z.object({
					platform: z.enum([Platform.Mac, Platform.Windows, Platform.Linux]),
					label: z.string(),
					href: z.string().url(),
					size: z.string().optional(),
				}),
			)
			.default([]),
	}),
});

export const collections = {
	apps,
	capabilities,
	changelog,
	releases,
	blog,
	tutorials,
	segments,
	compare,
};
