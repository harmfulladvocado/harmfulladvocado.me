import React from 'react'

interface RichTextProps {
  template: string
  values: Record<string, React.ReactNode>
}

const PLACEHOLDER_PATTERN = /(\{[a-zA-Z_]\w*\})/g
const PLACEHOLDER_EXACT_PATTERN = /^\{([a-zA-Z_]\w*)\}$/

export const RichText: React.FC<RichTextProps> = ({ template, values }) => {
  const parts = template.split(PLACEHOLDER_PATTERN)

  return (
    <>
      {parts.map((part: string, index: number) => {
        const match = PLACEHOLDER_EXACT_PATTERN.exec(part)

        if (match === null) {
          return <React.Fragment key={index}>{part}</React.Fragment>
        }

        const value = values[match[1]]

        return <React.Fragment key={index}>{value ?? part}</React.Fragment>
      })}
    </>
  )
}
