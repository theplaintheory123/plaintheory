import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-slate-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-slate-900 transition-colors focus:outline-none focus:ring-4 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
              : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/10'
          } ${className}`}
          {...props}
        />
        {hint && !error && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
