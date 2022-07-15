import { BaseDirectory, FileEntry, readDir } from '@tauri-apps/api/fs'
import { join } from '@tauri-apps/api/path'
import { ChildProcess, Command } from '@tauri-apps/api/shell'

import { ProjectStatus } from './types'

/* ["/C", { "validator": "\\S+" }] */

export async function checkProjects() {
  const projectsStatus: ProjectStatus[] = [],
    commands: Promise<ChildProcess>[] = [],
    test2: FileEntry[] = []

  const stackFolders = await readDir('Projects', {
    dir: BaseDirectory.Home
  })

  await getDirs(stackFolders, commands, test2)

  const commandsResults = await Promise.all(commands)

  for (let index = 0; index < commandsResults.length; index++) {
    getStatus(projectsStatus, commandsResults[index], test2[index * 2], test2[index * 2 + 1])
  }

  return projectsStatus
}

function getStatus(
  projectsStatus: ProjectStatus[],
  { stdout: stdout1, stderr: stderr1 }: ChildProcess,
  { name, path }: FileEntry,
  stackFolder: FileEntry
) {
  let gitUncommitted = false,
    gitRepository = false

  if (!stderr1) {
    if (stdout1.match('Changes not staged for commit:') || stdout1.match('Untracked files:')) {
      gitUncommitted = true
    }
    gitRepository = true
  } else {
    if (stderr1.match('not a git repository')) {
    } else {
      console.log(stderr1)
    }
  }

  projectsStatus.push({
    name: name!,
    path,
    folder: stackFolder.name!,
    gitUncommitted,
    gitRepository
  })
}

async function getDirs(stackFolders: FileEntry[], commands: Promise<ChildProcess>[], test2: FileEntry[]) {
  const projectFoldersArrayPromises = []
  const joinsPromises = []

  for (const stackFolder of stackFolders) {
    joinsPromises.push(join('Projects', stackFolder.name!))
  }

  const joins = await Promise.all(joinsPromises)

  for (const join of joins) {
    projectFoldersArrayPromises.push(
      readDir(join, {
        dir: BaseDirectory.Home
      })
    )
  }

  const projectFoldersArray = await Promise.all(projectFoldersArrayPromises)

  for (let i = 0; i < projectFoldersArray.length; i++) {
    for (const projectFolder of projectFoldersArray[i]) {
      const command1 = new Command('pwsh', ['/C', 'git status'], {
        cwd: projectFolder.path
      }).execute()

      commands.push(command1)
      test2.push(projectFolder, stackFolders[i])
    }
  }
}
