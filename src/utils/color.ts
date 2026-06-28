export interface ColorClasses {
  text: string;
  bg: string;
  border: string;
  solid: string;
  ring: string;
}

export const COURSE_COLORS: Record<string, ColorClasses> = {
  indigo: {
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    solid: 'bg-indigo-500 text-white',
    ring: 'ring-indigo-500/20',
  },
  rose: {
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    solid: 'bg-rose-500 text-white',
    ring: 'ring-rose-500/20',
  },
  teal: {
    text: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-800',
    solid: 'bg-teal-500 text-white',
    ring: 'ring-teal-500/20',
  },
  amber: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    solid: 'bg-amber-500 text-white',
    ring: 'ring-amber-500/20',
  },
  emerald: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    solid: 'bg-emerald-500 text-white',
    ring: 'ring-emerald-500/20',
  },
  violet: {
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800',
    solid: 'bg-violet-500 text-white',
    ring: 'ring-violet-500/20',
  },
  sky: {
    text: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-800',
    solid: 'bg-sky-500 text-white',
    ring: 'ring-sky-500/20',
  },
  orange: {
    text: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    solid: 'bg-orange-500 text-white',
    ring: 'ring-orange-500/20',
  },
};

export function getCourseColorClasses(colorName: string): ColorClasses {
  return COURSE_COLORS[colorName] || COURSE_COLORS.indigo;
}
