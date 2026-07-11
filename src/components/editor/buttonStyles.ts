export const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

export const primaryButton =
  `${buttonBase} bg-teal-700 text-white shadow-sm hover:bg-teal-800 focus:ring-teal-500`

export const secondaryButton =
  `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus:ring-slate-300`

export const subtleButton =
  `${buttonBase} text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300`

export const dangerButton =
  `${buttonBase} text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-200`

export const addButton =
  `${buttonBase} border border-dashed border-teal-400 bg-teal-50 text-teal-800 hover:bg-teal-100 focus:ring-teal-300`
