import { z } from 'zod'

export default interface Route {
  method: string
  path: string
  description: string
  schema: {
    response: z.ZodTypeAny
    params?: z.ZodTypeAny
    body?: z.ZodTypeAny
    query?: z.ZodTypeAny
  }
}
