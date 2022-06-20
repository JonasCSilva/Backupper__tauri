import { BaseDirectory, readDir } from '@tauri-apps/api/fs'
import { /* homeDir, */ join } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/api/shell'

import { ProjectStatus } from './types'

/* ["/C", { "validator": "\\S+" }] */

export async function checkProjects() {
  // const thisHomeDir = await homeDir()

  const projectsDirectory: ProjectStatus[] = []

  const stackFolders = await readDir('Projects', {
    dir: BaseDirectory.Home
  })

  for (const stackFolder of stackFolders) {
    // console.log(stackFolder.name)

    const projectFolders = await readDir(await join('Projects', stackFolder.name!), {
      dir: BaseDirectory.Home
    })

    for (const projectFolder of projectFolders) {
      // console.log('-- ' + projectFolder.name)

      try {
        await readDir(await join('Projects', stackFolder.name!, projectFolder.name!), {
          dir: BaseDirectory.Home
        })

        // console.log('---- Directory')

        projectsDirectory.push({ name: projectFolder.name!, path: projectFolder.path, folder: stackFolder.name! })

        // const cwd = await join(thisHomeDir, "Projects");

        const result = await new Command('pwsh', ['/C', 'git status'], {
          cwd: projectFolder.path
        }).execute()

        // console.log(result.stdout)
      } catch /* (error: any) */ {
        // console.log('---- File')
      }
    }
  }

  return projectsDirectory
}
