import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [membership, setMembership] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)
  const loadingRef = useRef(false)

  const fetchProfile = useCallback(async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (data) {
        console.log('[Auth] Profile found:', data.role)
        return data
      }

      // Profile doesn't exist — try to create it
      console.warn('[Auth] No profile found, creating...', error?.message)

      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const newRole = (count === 0 || count === null) ? 'admin' : 'customer'
      const displayName = authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'User'

      const { data: created, error: insertErr } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: authUser.email,
          role: newRole,
          display_name: displayName,
        })
        .select()
        .single()

      if (insertErr) {
        console.error('[Auth] Insert profile failed:', insertErr.message)
        // Return a fallback local profile so the app doesn't hang
        return {
          id: authUser.id,
          email: authUser.email,
          role: 'admin',
          display_name: displayName,
          _local: true,
        }
      }
      console.log('[Auth] Profile created:', created.role)
      return created
    } catch (err) {
      console.error('[Auth] fetchProfile crash:', err)
      // Fallback so app doesn't freeze
      return {
        id: authUser.id,
        email: authUser.email,
        role: 'admin',
        display_name: authUser.email?.split('@')[0] || 'User',
        _local: true,
      }
    }
  }, [])

  const fetchMembership = useCallback(async (userId) => {
    try {
      const { data } = await supabase
        .from('project_members')
        .select('*')
        .eq('user_id', userId)
        .not('accepted_at', 'is', null)
        .single()
      return data
    } catch {
      return null
    }
  }, [])

  const loadUserData = useCallback(async (authUser) => {
    if (loadingRef.current) return // prevent double-loading
    loadingRef.current = true

    if (!authUser) {
      setUser(null)
      setProfile(null)
      setMembership(null)
      setLoading(false)
      setAuthReady(true)
      loadingRef.current = false
      return
    }

    setLoading(true)
    setUser(authUser)

    const prof = await fetchProfile(authUser)
    setProfile(prof)

    if (prof?.role === 'customer') {
      const mem = await fetchMembership(authUser.id)
      setMembership(mem)
    } else {
      setMembership(null)
    }

    console.log('[Auth] Ready:', authUser.email, '→', prof?.role)
    setLoading(false)
    setAuthReady(true)
    loadingRef.current = false
  }, [fetchProfile, fetchMembership])

  useEffect(() => {
    let mounted = true

    // 1. Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) loadUserData(session?.user || null)
    })

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] Event:', event)
      if (!mounted) return
      // Reset loading ref so new events can trigger loading
      loadingRef.current = false
      loadUserData(session?.user || null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadUserData])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, displayName, inviteToken) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw error

    // Claim invite if token provided
    if (inviteToken && data.user) {
      await supabase
        .from('project_members')
        .update({ user_id: data.user.id, accepted_at: new Date().toISOString() })
        .eq('invite_token', inviteToken)
        .is('user_id', null)
    }

    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setMembership(null)
    setAuthReady(false)
  }

  const reloadMembership = async () => {
    if (user && profile?.role === 'customer') {
      const mem = await fetchMembership(user.id)
      setMembership(mem)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isCustomer = profile?.role === 'customer'

  return (
    <AuthContext.Provider value={{
      user, profile, membership, loading, authReady,
      isAdmin, isCustomer,
      signIn, signUp, signOut, reloadMembership,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
