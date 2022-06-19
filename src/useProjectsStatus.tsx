import { useEffect, useState } from 'react'

import { checkProjects } from './checkProjects'
import { ProjectStatus } from './types'

export default function useProjectStatus() {
  const [projectsStatus, setProjectsStatus] = useState<ProjectStatus[]>([])

  useEffect(() => {
    checkProjects().then(setProjectsStatus)
  }, [])

  return projectsStatus
}
