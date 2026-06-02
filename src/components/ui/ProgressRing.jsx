function ProgressRing({
  value,
  size = 108,
  stroke = 10,
  label,
  sublabel,
  className = '',
  trackClassName = 'text-slate-100 dark:text-slate-800',
  progressClassName = 'text-emerald-400',
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={`relative grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={trackClassName}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <circle
          className={progressClassName}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{label ?? `${value}%`}</p>
        {sublabel ? <p className="text-[0.68rem] font-medium text-slate-400">{sublabel}</p> : null}
      </div>
    </div>
  )
}

export default ProgressRing
