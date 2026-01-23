'use server'

import { searchWorkspace } from '@/lib/supabase/queries'
import type { SearchResult } from '@/lib/types/database'

export async function searchWorkspaceAction(
  workspaceId: string,
  query: string
): Promise<SearchResult[]> {
  if (!query || query.length < 2) {
    return []
  }

  return searchWorkspace(workspaceId, query)
}
