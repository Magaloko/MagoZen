import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { CUSTOMER, PHASES, RISKS, DNS_RECORDS, MACROS, GOLIVELISTE, FRAGENKATALOG, DEMO_CHECKLIST, DEMO_MILESTONES, FAQ_HFK, UPSELLS, LIZENZEN } from '../data/hfkData'

const ProjectContext = createContext(null)

// HFK seed — used only when no projects exist yet
const HFK_SEED = {
  name: 'Herr & Frau Klein GmbH',
  short_name: 'HFK',
  status: 'active',
  customer_data: {
    name: CUSTOMER.name,
    short: CUSTOMER.short,
    url: CUSTOMER.url,
    email: CUSTOMER.email,
    zendeskSubdomain: CUSTOMER.zendeskSubdomain,
    hoster: CUSTOMER.hoster,
    markt: CUSTOMER.markt,
    timezone: CUSTOMER.timezone,
    sortiment: CUSTOMER.sortiment,
    volumen: CUSTOMER.volumen,
    aktuelleKanäle: CUSTOMER.aktuelleKanäle,
    jtlShop: CUSTOMER.jtlShop,
    jtlWawi: CUSTOMER.jtlWawi,
    branding: CUSTOMER.branding,
  },
  service_package: {
    plan: 'Suite Professional',
    plan_price_per_agent: 115,
    agents_full: 4,
    agents_light: 2,
    addons: ['copilot', 'jtl'],
    phases: PHASES,
    risks: RISKS,
    dns_records: DNS_RECORDS,
    macros: MACROS,
    goliveliste: GOLIVELISTE,
    fragenkatalog: FRAGENKATALOG,
    demo_checklist: DEMO_CHECKLIST,
    demo_milestones: DEMO_MILESTONES,
    faq: FAQ_HFK,
    upsells: UPSELLS,
    lizenzen: LIZENZEN,
  },
  settings: {
    branding: CUSTOMER.branding,
    timezone: 'Wien UTC+1/+2',
    language: 'de',
    notes: '',
  },
}

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeded, setSeeded] = useState(false)

  const loadProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) {
      setProjects(data)
      return data
    }
    return []
  }, [])

  useEffect(() => {
    const init = async () => {
      const data = await loadProjects()
      // Auto-seed HFK if no projects exist
      if (data.length === 0 && !seeded) {
        setSeeded(true)
        const { data: inserted, error } = await supabase
          .from('projects')
          .insert([HFK_SEED])
          .select()
          .single()
        if (!error && inserted) {
          setProjects([inserted])
        }
      }
      setLoading(false)
    }
    init()
  }, [loadProjects, seeded])

  const createProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()
    if (!error && data) {
      setProjects(prev => [...prev, data])
      return data
    }
    throw error
  }

  const updateProject = async (id, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setProjects(prev => prev.map(p => p.id === id ? data : p))
      return data
    }
    throw error
  }

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id))
    }
    if (error) throw error
  }

  const getProjectById = (id) => projects.find(p => p.id === id) || null

  return (
    <ProjectContext.Provider value={{ projects, loading, createProject, updateProject, deleteProject, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider')
  return ctx
}

// Hook for a single project by ID (used inside project routes)
export function useProject(id) {
  const { getProjectById, updateProject, loading } = useProjects()
  const project = getProjectById(id)
  const update = (updates) => updateProject(id, updates)
  return { project, update, loading }
}
