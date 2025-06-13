import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono();
// Root route
app.get('/', (c) => {
  return c.text('Hello Hono!');
})
app.post('/api', 
zValidator('form', z.object({ body: z.string() })),
  (c) => {
    const validated = c.req.valid('form');
    return c.text('POST /api');
  }
)

// GET /api using OpenAPI
app.openapi(
  createRoute({
    method: 'get',
    path: '/api',
    request: {
      params: z.object({ name: z.string().optional() })
    },
    responses: {
      200: {
        description: 'Respond a hello message',
        content: {
          'application/json': {
            schema: z.object({ message: z.string() })
          }
        }
      }
    }
  }),
  (c) => {
    const query = c.req.query('name');
    return c.json({ message: `Hello ${query}!` });
  }
);

// API documentation
app.doc('/doc', {
  info: {
    title: 'Tokuron API',
    version: 'v1'
  },
  openapi: '3.1.0'
});

// Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }));
app.get('/github-models', async (c) => {
  const apiUrl = 'https://models.github.ai/inference/chat/completions';
  const headers = {
    'Authorization': `Bearer ${c.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    messages: [{ role: 'user', content: '生成AIを用いたコーディング手法とは？' }],
    model: 'openai/gpt-4.1'
  });

  const response = await fetch(apiUrl, { method: 'POST', headers, body });
  const data = await response.json();
  return c.text(data.choices[0].message.content);
});

// 404 handler
app.notFound((c) => c.text('Custom 404 Message', 404));

// Export the app
export default app;

