import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ADMIN_ONLY_SEGMENTS = ['intern', 'angebot', 'settings']

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, profile, membership, loading, isAdmin, isCustomer } = useAuth()
  const location = useLocation()
  const { projectId } = useParams()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
        Laden...
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Route requires admin but user is customer
  if (requireAdmin && !isAdmin) {
    if (isCustomer && membership?.project_id) {
      return <Navigate to={`/projects/${membership.project_id}`} replace />
    }
    return <Navigate to="/login" replace />
  }

  // Customer on a project page → check page visibility
  if (isCustomer && projectId) {
    // Customer can only access their assigned project
    if (membership?.project_id !== projectId) {
      return <Navigate to={`/projects/${membership?.project_id}`} replace />
    }

    // Check segment visibility
    const pathParts = location.pathname.split('/')
    const segment = pathParts[pathParts.length - 1]

    // Admin-only segments are always blocked
    if (ADMIN_ONLY_SEGMENTS.includes(segment)) {
      return <Navigate to={`/projects/${projectId}`} replace />
    }

    // Check if segment is in visible_pages (dashboard '' is always visible)
    const visiblePages = membership?.visible_pages || []
    if (segment !== projectId && !visiblePages.includes(segment)) {
      return <Navigate to={`/projects/${projectId}`} replace />
    }
  }

  return <Outlet />
}
