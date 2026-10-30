export type ThemeMode = 'dark' | 'light'

export type SocialIcon = 'discord' | 'github' | 'spigot'

export interface NavigationItem {
  hash: string
  id: string
  label: string
}

export interface SocialLink {
  href: string
  icon: SocialIcon
  label: string
}

export interface ProjectAction {
  external: boolean
  href: string
  label: string
}

export interface Project {
  actions: ProjectAction[]
  description: string
  featured: boolean
  id: string
  name: string
  tag: string
}

export interface Skill {
  hours: number
  label: string
  name: string
  percent: number
}
