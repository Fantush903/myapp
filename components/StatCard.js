import styles from './StatCard.module.css'

export default function StatCard({ label, value, change, trend, color }) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.change} ${styles[trend]}`}>{change}</div>
    </div>
  )
}
