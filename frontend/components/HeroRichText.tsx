import { PortableText } from '@portabletext/react'

/**
 * Renders Sanity Portable Text with custom color and fontSize annotations.
 * Used for Hero section rich text that supports color/size editing from the CMS.
 */
export default function HeroRichText({ value, className }: { value: any; className?: string }) {
  if (!value) return null

  return (
    <div className={className}>
      <PortableText
        value={value}
        components={{
          block: {
            h1: ({ children }) => <h1>{children}</h1>,
            h2: ({ children }) => <h2>{children}</h2>,
            h3: ({ children }) => <h3>{children}</h3>,
            normal: ({ children }) => <p>{children}</p>,
          },
          marks: {
            color: ({ children, value: mark }) => (
              <span style={{ color: mark?.hex || 'inherit' }}>{children}</span>
            ),
            fontSize: ({ children, value: mark }) => (
              <span style={{ fontSize: mark?.size || 'inherit' }}>{children}</span>
            ),
            link: ({ children, value: mark }) => (
              <a href={mark?.href} style={{ color: 'inherit', textDecoration: 'underline' }}>{children}</a>
            ),
          },
        }}
      />
    </div>
  )
}
