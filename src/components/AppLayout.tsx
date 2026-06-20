import { Link, Outlet } from '@tanstack/react-router'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Policies', to: '/' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">Gaia Controller</div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="sidebar__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}