import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

import { App } from './App.tsx'
import homepage from './content/homepage.json'
import projectsData from './content/projects.json'
import site from './content/site.json'
import skillsData from './content/skills.json'
import { calculateAge } from './utils/age.ts'

beforeEach(() => {
  window.history.pushState({}, '', '/')
  window.localStorage.clear()
  document.title = site.title
  delete document.documentElement.dataset.theme
})

afterEach(() => {
  cleanup()
})

describe('App', () => {
  it('renders the home sections and dynamic age', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(homepage.hero['heading-line'])
    expect(screen.getByText(String(calculateAge(site['age-epoch'])))).toBeDefined()
    expect(screen.getByRole('heading', { level: 2, name: 'about' })).toBeDefined()
    expect(screen.getByRole('heading', { level: 2, name: 'projects' })).toBeDefined()
    expect(screen.getByRole('heading', { level: 2, name: 'stack' })).toBeDefined()
  })

  it('renders every configured project', () => {
    render(<App />)

    projectsData.projects.forEach((project) => {
      expect(screen.getByRole('heading', { level: 3, name: project.name })).toBeDefined()
    })
  })

  it('exposes every skill as a progress bar', () => {
    render(<App />)

    const bars = screen.getAllByRole('progressbar')

    expect(bars).toHaveLength(skillsData.skills.length)
    expect(bars[0].getAttribute('aria-valuenow')).toBe(String(skillsData.skills[0].percent))
    expect(bars[0].getAttribute('aria-label')).toBe(`${skillsData.skills[0].name} proficiency`)
  })

  it('renders social links as external links', () => {
    render(<App />)

    const github = screen.getByTitle('GitHub')
    const discord = screen.getByTitle('Discord')

    expect(github.getAttribute('href')).toBe('https://github.com/harmfulladvocado')
    expect(github.getAttribute('target')).toBe('_blank')
    expect(discord.getAttribute('href')).toContain('discord.com')
    expect(discord.getAttribute('rel')).toBe('noreferrer')
  })

  it('toggles and persists the theme', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
  })

  it('opens and closes the mobile navigation', () => {
    render(<App />)

    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(menuButton)

    expect(menuButton.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeDefined()
  })

  it('renders the not found page for unknown paths', () => {
    window.history.pushState({}, '', '/missing')
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('404')
    expect(screen.getByRole('link', { name: 'back home' }).getAttribute('href')).toBe('/')
    expect(document.title).toBe(site['not-found-title'])
  })
})
