import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Drop-in replacement for useLocalStorage — syncs to Supabase hfk_state table.
// Falls back to localStorage when offline. Same [value, setValue] API.
export function useSupabaseState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const cached = window.localStorage.getItem(key)
      return cached ? JSON.parse(cached) : initialValue
    } catch {
      return initialValue
    }
  })

  // Ref always holds the latest value — avoids stale closures
  const latestRef = useRef(value)
  latestRef.current = value

  const saveTimer = useRef(null)

  // Load from Supabase on mount
  useEffect(() => {
    supabase
      .from('hfk_state')
      .select('value')
      .eq('key', key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data?.value !== undefined) {
          latestRef.current = data.value
          setValue(data.value)
          try { window.localStorage.setItem(key, JSON.stringify(data.value)) } catch {}
        }
      })
  }, [key])

  const set = useCallback((newValueOrFn) => {
    // Compute next value synchronously using latest ref (no stale closure)
    const next = typeof newValueOrFn === 'function'
      ? newValueOrFn(latestRef.current)
      : newValueOrFn

    latestRef.current = next
    setValue(next)

    // Persist to localStorage immediately as offline cache
    try { window.localStorage.setItem(key, JSON.stringify(next)) } catch {}

    // Debounced save to Supabase (300ms after last change)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      supabase
        .from('hfk_state')
        .upsert({ key, value: next, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('[useSupabaseState] save error:', key, error.message)
        })
    }, 300)
  }, [key])

  return [value, set]
}
