import { LayoutDashboard, FileCode, FolderGit2, Network, Bot } from 'lucide-react'

// sidebar + mobile nav dono yahi list use karte hain
export const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/files', label: 'Files', icon: FileCode },
  { to: '/repos', label: 'Repositories', icon: FolderGit2 },
  { to: '/structure', label: 'Structure', icon: Network },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
]

export const SUGGESTED_QUESTIONS = [
  'What does this project do?',
  'Where does the main flow start?',
  'Which files are the most important?',
  'How is error handling done?',
]
