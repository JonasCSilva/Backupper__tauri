import { BaseDirectory, FileEntry, readDir } from '@tauri-apps/api/fs'
import { join } from '@tauri-apps/api/path'
import { ChildProcess, Command } from '@tauri-apps/api/shell'

import { ProjectStatus } from './types'

/* ["/C", { "validator": "\\S+" }] */

export async function checkProjects() {
  const projectsStatus: ProjectStatus[] = [],
    commands: Promise<ChildProcess>[] = [],
    test2: FileEntry[] = []

  await getDirs(commands, test2)

  const commandsResults = await Promise.all(commands)

  for (let index = 0; index < commandsResults.length / 2; index++) {
    getStatus(
      projectsStatus,
      commandsResults[index * 2],
      commandsResults[index * 2 + 1],
      test2[index * 2],
      test2[index * 2 + 1]
    )
  }

  return projectsStatus
}

function getStatus(
  projectsStatus: ProjectStatus[],
  { stdout: stdout1, stderr: stderr1 }: ChildProcess,
  { stdout: stdout2, stderr: stderr2 }: ChildProcess,
  { name, path }: FileEntry,
  stackFolder: FileEntry
) {
  let gitUncommitted = false,
    plasticUncommited = false,
    gitRepository = false,
    plasticWorkspace = false

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

  if (!stderr2) {
    if (stdout2.match('Changed') || stdout2.match('Added')) {
      plasticUncommited = true
    }
    plasticWorkspace = true
  } else {
    if (stderr2.match('is not in a workspace')) {
    } else {
      console.log(stderr2)
    }
  }

  projectsStatus.push({
    name: name!,
    path,
    folder: stackFolder.name!,
    gitUncommitted,
    plasticUncommited,
    gitRepository,
    plasticWorkspace
  })
}

async function getDirs(commands: Promise<ChildProcess>[], test2: FileEntry[]) {
  const stackFolders = await readDir('Projects', {
    dir: BaseDirectory.Home
  })

  for (const stackFolder of stackFolders) {
    const projectFolders = await readDir(await join('Projects', stackFolder.name!), {
      dir: BaseDirectory.Home
    })

    for (const projectFolder of projectFolders) {
      try {
        await readDir(await join('Projects', stackFolder.name!, projectFolder.name!), {
          dir: BaseDirectory.Home
        })

        const command1 = new Command('pwsh', ['/C', 'git status'], {
          cwd: projectFolder.path
        }).execute()

        const command2 = new Command('pwsh', ['/C', 'cm status --all'], {
          cwd: projectFolder.path
        }).execute()

        commands.push(command1, command2)
        test2.push(projectFolder, stackFolder)
      } catch (error: any) {
        // If not file
        if (!error.match('The directory name is invalid')) {
          console.log(error)
        }
      }
    }
  }
}
