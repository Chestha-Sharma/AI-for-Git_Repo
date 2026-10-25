export const formatDateTime = (ts) => new Date(ts).toLocaleString()

export const makeId = () => Math.random().toString(36).slice(2, 10)

// filters ke hisaab se files chhaanta hai (path search, language, repo)
export const filterFiles = (files, filters) => {
  const { q, language, repo } = filters
  const text = q.trim().toLowerCase()

  return files.filter(
    (f) =>
      (language === 'ALL' || f.language === language) &&
      (repo === 'ALL' || f.repo === repo) &&
      (!text || f.path.toLowerCase().includes(text))
  )
}
