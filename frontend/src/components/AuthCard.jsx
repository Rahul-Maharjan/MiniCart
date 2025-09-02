export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10 text-slate-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center select-none">
          <h1 className="text-3xl font-semibold tracking-tight">
            Mini<span className="text-blue-600">Cart</span>
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 blur transition" />
          <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl px-7 py-8">
            <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>
            {children}
            {footer && (
              <div className="mt-6 text-center text-sm text-slate-600">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
