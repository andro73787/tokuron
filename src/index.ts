// index.ts

import { Hono } from 'hono'
import { logger } from 'hono/logger'
import {zValidator } from '@hono/zod-validator'
import {z, createRoute, OpenAPIHono } from '@hono/zod-openapi'

const app = new Hono()

app.use(logger())

app.post('/api', 
  zValidator ('form', z.object({body: z.string()})) ,// Хариулт буцаах хэсэг нэмэв
  (c) => {
    const validated = c.req.valid('form')
    return c.text ('POST /api')
  }
)

export default app

