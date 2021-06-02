import { createClient } from '@supabase/supabase-js'
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default ({ app }, inject) => {
  inject('db', db)
}
