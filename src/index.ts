// index.ts

import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { swaggerUI } from '@hono/swagger-ui'
const app = new Hono()

app.use(logger())

// Add the POST /api route
app.post(
  '/api',
  zValidator('form', z.object({ body: z.string() })),
  (c) => {
    const validated = c.req.valid('form')
    return c.text('POST /api')
  }
)

// Check the h.page
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// /api test with query
app.get('/api', (c) => {
  const query = c.req.query('name')
  return c.json({ message: `Hello ${query}!` })
})

// 404 not found 
app.notFound((c) => c.text('Custom 404 Message', 404))

// Export do
export default app

