import React from 'react'
import { Loader } from 'lucide-react'

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader className="size-8 animate-spin" />
    </div>
  )
}

export default PageLoader
