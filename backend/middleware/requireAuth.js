import { supabase } from '../config/supabase.js'
import { env } from '../config/env.js'

const DEFAULT_LOCAL_USER_ID = '00000000-0000-0000-0000-000000000001'

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

    if (!token) {
      req.user = { id: env.developmentUserId || DEFAULT_LOCAL_USER_ID }
      next()
      return
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data?.user?.id) {
      res.status(401).json({ error: 'Invalid or expired authentication token.' })
      return
    }

    req.user = { id: data.user.id }
    next()
  } catch (error) {
    next(error)
  }
}
