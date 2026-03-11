import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Project-scoped state hook — reads/writes project_state table.
// Falls back to localStorage when offline. Same [value, setValue] API.
export function useProjectState(key, initialValue, projectId) {
  const storageKey = projectId ? `proj-${projectId}-${key}` : `hfk-${key}`

  const [value, setValue] = useState(() => {
    try {
      const cached = window.localStorage.getItem(storageKey)
      return cached ? JSON.parse(cached) : initialValue
    } catch {
      return initialValue
    }
  })

  // Ref always holds the latest value — avoids stale closures + StrictMode issues
  const latestRef = useRef(value)
  latestRef.current = value

  const saveTimer = useRef(null)

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    supabase
      .from('project_state')
      .select('value')
      .eq('project_id', projectId)
      .eq('key', key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data?.value !== undefined) {
          latestRef.current = data.value
          setValue(data.value)
          try { window.localStorage.setItem(storageKey, JSON.stringify(data.value)) } catch {}
        }
      })
    return () => { cancelled = true }
  }, [key, projectId, storageKey])

  useEffect(() => {
    return () => { clearTimeout(saveTimer.current) }
  }, [])

  const set = useCallback((newValueOrFn) => {
    const next = typeof newValueOrFn === 'function'
      ? newValueOrFn(latestRef.current)
      : newValueOrFn

    latestRef.current = next
    setValue(next)

    try { window.localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}

    if (projectId) {
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        supabase
          .from('project_state')
          .upsert({ project_id: projectId, key, value: next, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error('[useProjectState] save error:', key, error.message)
          })
      }, 300)
    }
  }, [key, projectId, storageKey])

  return [value, set]
}
