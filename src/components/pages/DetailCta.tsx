import { PrimaryCta, SecondaryActions } from '@/components/cta/CtaLinks'
import { StarField } from '@/components/patterns/Patterns'

/** Closing call to action for detail pages (course, lecturer, article). */
export function DetailCta({
  id,
  title,
  body,
}: {
  id: string
  title: string
  body?: string | null
}) {
  return (
    <section
      data-tone="dark"
      className="relative isolate overflow-hidden bg-navy py-16 text-white lg:py-20"
    >
      <StarField tone="lime" count={4} />
      <div className="container-arus relative grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-section font-bold">{title}</h2>
          {body ? <p className="mt-4 max-w-xl text-lead text-white/80">{body}</p> : null}
        </div>
        <div className="grid gap-5 lg:col-span-5 lg:justify-items-end">
          <PrimaryCta id={id} tone="dark" placement={id} />
          <SecondaryActions placement={id} />
        </div>
      </div>
    </section>
  )
}
