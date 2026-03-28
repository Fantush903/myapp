import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', active: true },
  { icon: '◎', label: 'Analytics' },
  { icon: '⊡', label: 'Projects' },
  { icon: '✉', label: 'Messages' },
  { icon: '☆', label: 'Reports' },
  { icon: '◈', label: 'Settings' },
]

export default function Sidebar({ user }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.dot}>M</div>
        <span>MyApp</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <div
            key={item.label}
            className={`${styles.navItem} ${item.active ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userBadge}>
          <div className={styles.avatar}>{user?.initials || '??'}</div>
          <div className={styles.userInfo}>
            <div className={styles.name}>{user?.name || 'User'}</div>
            <div className={styles.role}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
