import { useMemo } from 'react'
import useFileStore from '../store/useFileStore.js'
import { filterFiles } from '../lib/utils.js'

const useFilteredFiles = () => {
  const files = useFileStore((s) => s.files)
  const filters = useFileStore((s) => s.filters)
  return useMemo(() => filterFiles(files, filters), [files, filters])
}

export default useFilteredFiles
