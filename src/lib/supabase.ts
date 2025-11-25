import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../utils/supabase/info'

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    )
  }
  return supabaseClient
}

export async function getServerUrl(path: string) {
  return `https://${projectId}.supabase.co/functions/v1/make-server-efd95974${path}`
}

export async function fetchFromServer(path: string, options: RequestInit = {}) {
  const url = await getServerUrl(path)
  const supabase = createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token || publicAnonKey
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  return response.json()
}
