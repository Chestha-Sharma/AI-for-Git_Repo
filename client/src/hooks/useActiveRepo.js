import useRepoStore from '../store/useRepoStore.js'

// jis repo par kaam chal raha hai uska poora object (nahi hai to null)
const useActiveRepo = () => {
  const repos = useRepoStore((s) => s.repos)
  const activeRepo = useRepoStore((s) => s.activeRepo)
  return repos.find((r) => r.id === activeRepo) || null
}

export default useActiveRepo
