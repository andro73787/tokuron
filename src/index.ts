import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { swaggerUI } from '@hono/swagger-ui';

// Hono-г OpenAPIHono change
const app = new OpenAPIHono();

app.use(logger());

// POST /api роут (OpenAPI )
app.post(
  '/api',
  zValidator('form', z.object({ body: z.string() })),
  (c) => {
    const validated = c.req.valid('form');
    return c.text('POST /api');
  }
);

// GET /api - OpenAPI-р change
app.openapi(
createRoute({
  method: 'get',
  path: '/api',
  request: {
    params: z.object({name: z.string().optional() })
  },
  responses: {
    200: {
      description: 'Respond a hello message',
      content: {
        'application/json': {schema: z.object({message: z.string() })}
        
      }
    }
  }
}),
(c) => { 
const query = c.req.query('name'); 
  return c.json({ message: `Hello ${query}!` })
})
// Root
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// OpenAPI JSON 
app.doc('/doc', {
  info: {
    title: 'Tokuron API',
    version: 'v1'
  },
  openapi: '3.1.0'
});

// Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }));

app.notFound((c) => c.text('Custom 404 Message', 404));

export default app;