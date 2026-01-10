import { z } from 'zod';
import { insertArticleSchema, insertStockSchema, articles, stocks } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  articles: {
    list: {
      method: 'GET' as const,
      path: '/api/articles',
      input: z.object({
        category: z.string().optional(),
        featured: z.string().optional(), // "true" or "false"
        limit: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof articles.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/articles/:slug',
      responses: {
        200: z.custom<typeof articles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/articles',
      input: insertArticleSchema,
      responses: {
        201: z.custom<typeof articles.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/articles/:id',
      input: insertArticleSchema.partial(),
      responses: {
        200: z.custom<typeof articles.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/articles/:id',
      responses: {
        204: z.null(),
        404: errorSchemas.notFound,
      },
    },
    search: {
      method: 'GET' as const,
      path: '/api/search',
      input: z.object({
        q: z.string(),
      }),
      responses: {
        200: z.array(z.custom<typeof articles.$inferSelect>()),
      },
    },
  },
  stocks: {
    list: {
      method: 'GET' as const,
      path: '/api/stocks',
      responses: {
        200: z.array(z.custom<typeof stocks.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/stocks/:symbol',
      responses: {
        200: z.custom<typeof stocks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
