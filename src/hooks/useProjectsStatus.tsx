import { useEffect, useState } from 'react'

import { checkProjects } from '../utils/checkProjects'
import { ProjectStatus } from '../utils/types'

export default function useProjectStatus() {
  const [projectsStatus, setProjectsStatus] = useState<ProjectStatus[]>([])

  useEffect(() => {
    checkProjects().then(setProjectsStatus)
  }, [])

  return projectsStatus
}
