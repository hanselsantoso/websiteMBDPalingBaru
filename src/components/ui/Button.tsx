import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { isExternalHref } from '@/lib/links'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'primaryDark' | 'secondary' | 'secondaryDark' | 'ghost' | 'ghostDark'

export const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'pill border-2 border-navy bg-blue text-white shadow-hard hover:-translate-y-0.5 active:shadow-hard-sm',
  primaryDark: 'pill border-2 border-navy bg-lime text-navy shadow-hard-cyan hover:-translate-y-0.5',
  secondary: 'pill border-2 border-navy bg-white text-navy hover:bg-ink-50',
  secondaryDark: 'pill border-2 border-white/70 bg-transparent text-white hover:bg-white/10',
  ghost: 'pill px-3 text-navy underline decoration-2 underline-offset-4 hover:decoration-blue',
  ghostDark: 'pill px-3 text-white underline decoration-2 underline-offset-4 decoration-lime/70 hover:decoration-lime',
}

type CommonProps = { variant?: ButtonVariant; className?: string; children: ReactNode }

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>) {
  const classes = cn(buttonStyles[variant], 'focus-visible:outline-offset-4', className)
  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  )
}

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button type={type} className={cn(buttonStyles[variant], 'disabled:cursor-not-allowed disabled:opacity-60', className)} {...rest}>
      {children}
    </button>
  )
}
