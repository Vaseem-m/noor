function CardHeader({ eyebrow, title, description, action, inverse = false }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-5">
      <div className="min-w-0">
        {eyebrow ? (
          <p className={`text-sm font-medium ${inverse ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-300'}`}>
            {eyebrow}
          </p>
        ) : null}
        <h2 className={`mt-1 text-xl font-semibold tracking-tight sm:text-2xl ${inverse ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
          {title}
        </h2>
        {description ? (
          <p className={`mt-2 max-w-sm text-sm leading-6 ${inverse ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 self-start sm:self-auto">{action}</div> : null}
    </div>
  )
}

export default CardHeader
