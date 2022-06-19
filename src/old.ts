import chalk from 'chalk'
import child_process from 'child_process'
import { promises as fs } from 'fs'
import os from 'os'
import nodePath from 'path'
import util from 'util'

const exec = util.promisify(child_process.exec)

const myFullPath = nodePath.join(os.homedir(), '/Projects')

const log = console.log

export async function main() {
  try {
    const stackFolders = await fs.readdir(myFullPath)
    for (const stackFolder of stackFolders) {
      try {
        const projectFolders = await fs.readdir(nodePath.join(myFullPath, stackFolder))
        for (const projectFolder of projectFolders) {
          GetUncomitted(stackFolder, projectFolder)
        }
      } catch (err) {
        console.error(err)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

async function GetUncomitted(stackFolder: string, projectFolder: string) {
  const localPath = nodePath.join(stackFolder, projectFolder)

  const projectPath = nodePath.join(myFullPath, localPath)

  try {
    const { stdout, stderr } = await exec(`cd ${projectPath} && git status`)
    if (stderr) console.error('stderr:', stderr)
    else {
      const wordsFiltered = stdout.match(/\tmodified:.+\n/g)

      if (wordsFiltered) {
        const wordsFiltered2 = wordsFiltered.map((word: string) => word.slice(1, -1))

        const wordsFiltered3 = wordsFiltered2.map((val: string) => val.split(' ').filter(Boolean).pop())

        log(chalk.yellow('\n' + localPath))

        wordsFiltered3.forEach((result: string | undefined) => {
          log(chalk.red(result))
        })
      } else if (stdout.match('nothing to commit')) {
        log(chalk.yellow('\n' + localPath))
        log(chalk.green('No modified files!'))
      } else {
        log(stdout)
      }
    }
  } catch (err: any) {
    if (err.stderr.match('not a git repository')) {
      try {
        const { stdout, stderr } = await exec(`cd ${projectPath} && cm status --all`)
        if (stderr) console.error('stderr:', stderr)
        else {
          const wordsFiltered = stdout.match(/Path[\W\w]+/g)

          if (wordsFiltered) {
            const wordsFiltered2 = wordsFiltered[0].match(/\s+\S+\s+\r\n/g)

            if (wordsFiltered2) {
              const wordsFiltered3 = wordsFiltered2.map((val: string) => val.split(' ').filter(Boolean).shift())

              log(chalk.yellow('\n' + localPath))

              wordsFiltered3.forEach((result: string | undefined) => {
                log(chalk.red(result))
              })
            } else {
              log(chalk.red('Error'))
            }
          } else {
            log(chalk.yellow('\n' + localPath))
            log(chalk.green('No modified files!'))
          }
        }
      } catch (err: any) {
        if (err.stderr.match('is not in a workspace.') || err.stderr.match('cm: not found')) {
          log(chalk.yellow('\n' + localPath))
          log(chalk.bold.red('Not a Git Repository or a Plastic Workspace'))
        } else {
          console.error(err.stderr)
        }
      }
    } else {
      console.error(err.stderr)
    }
  }
}
