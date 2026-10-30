import React from 'react'

import site from '../content/site.json'

export const NotFound: React.FC = () => {
  React.useEffect(() => {
    const previousTitle = document.title
    document.title = site['not-found-title']

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <section className="not-found">
      <p className="not-found__eyebrow">error / 404</p>
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">
        this page doesn't exist, or it moved somewhere else. either way, you took a wrong turn.
      </p>
      <a className="not-found__link" href="/">
        back home
      </a>
    </section>
  )
}
