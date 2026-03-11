import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [membership, setMembership] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return data
  }, [])

  const fetchMembership = useCallback(async (userId) => {
    const { data } = await supabase
      .from('project_members')
      .select('*')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .single()
    return data
  }, [])

  const loadUserData = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null)
      setProfile(null)
      setMembership(null)
      setLoading(false)
      return
    }

    setUser(authUser)
    const prof = await fetchProfile(authUser.id)
    setProfile(prof)

    if (prof?.role === 'customer') {
      const mem = await fetchMembership(authUser.id)
      setMembership(mem)
    } else {
      setMembership(null)
    }

    setLoading(false)
  }, [fetchProfile, fetchMembership])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserData(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserData(session?.user || null)
    })

    return () => subscription.unsubscribe()
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
  }

  // Reload membership data (used after admin changes visibility)
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
      user, profile, membership, loading,
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
