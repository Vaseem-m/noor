function Card({ children, className = '' }) {
  return (
    <section
      className={`mb-6 inline-block w-full break-inside-avoid rounded-[2.25rem] border border-white/75 bg-white/82 p-6 shadow-[0_18px_54px_rgba(15,23,42,0.07)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 ${className}`}
    >
      {children}
    </section>
  )
}

export default Card
