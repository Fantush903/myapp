'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import StatCard from '../../components/StatCard'
import styles from './dashboard.module.css'

const STATS = [
  { label: 'Total Users',      value: '4,821',  change: '↑ 12.4% this month', trend: 'up',   color: 'purple' },
  { label: 'Revenue',          value: '$32.1k', change: '↑ 8.7% vs last month', trend: 'up', color: 'green'  },
  { label: 'Active Sessions',  value: '284',    change: '↑ 3.2% today',        trend: 'up',   color: 'amber'  },
  { label: 'Bounce Rate',      value: '24.6%',  change: '↑ 1.1% (worse)',      trend: 'down', color: 'red'    },
]

const ACTIVITY = [
  { color: '#3ecf8e', text: 'New user sarah_k signed up via Google OAuth',     time: '2 minutes ago'       },
  { color: '#6c63ff', text: 'Project Phoenix v2 deployed to production',        time: '18 minutes ago'      },
  { color: '#ffc14d', text: 'API usage nearing monthly limit — 87% consumed',  time: '1 hour ago'          },
  { color: '#3ecf8e', text: 'Revenue milestone: $30k MRR reached!',            time: 'Yesterday, 4:12 PM'  },
  { color: '#ff6b6b', text: 'Failed login attempt detected from IP 192.168.x', time: 'Yesterday, 11:03 AM' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(stored))
  }, [router])

  function handleLogout() {
    sessionStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null   // still loading / redirecting

  const firstName = user.name.split(' ')[0]
  const loginTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.layout}>
      <Sidebar user={user} />

      <main className={styles.main}>
        {/* Top bar */}
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.greeting}>{getGreeting()}, {firstName} 👋</h1>
            <p className={styles.date}>{formatDate()}</p>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>

        {/* Stat cards */}
        <div className={styles.statsGrid}>
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Bottom grid */}
        <div className={styles.bottomGrid}>
          {/* Activity feed */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityDot} style={{ background: a.color }} />
                <div>
                  <p className={styles.activityText}>{a.text}</p>
                  <p className={styles.activityTime}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Profile card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Your Profile</h2>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>{user.initials}</div>
              <div>
                <p className={styles.profileName}>{user.name}</p>
                <p className={styles.profileEmail}>{user.email}</p>
              </div>
            </div>

            {[
              { label: 'Account type', value: 'Admin' },
              { label: 'Member since', value: 'Jan 2024' },
              { label: 'Last login',   value: loginTime  },
              { label: 'Projects',     value: '7'        },
            ].map(row => (
              <div key={row.label} className={styles.profileRow}>
                <span>{row.label}</span>
                <span className={styles.profileVal}>{row.value}</span>
              </div>
            ))}

            <div className={styles.tag}>✓ Verified Account</div>
          </div>
        </div>
      </main>
    </div>
  )
}
