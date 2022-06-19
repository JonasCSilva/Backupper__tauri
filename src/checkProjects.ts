import { Command } from "@tauri-apps/api/shell";
import { homeDir, join } from "@tauri-apps/api/path";
import { BaseDirectory, readDir } from "@tauri-apps/api/fs";

export async function checkProjects() {
  console.log("Here!");

  const thisHomeDir = await homeDir();

  const cwd = await join(thisHomeDir, "Projects");

  /* ["/C", { "validator": "\\S+" }] */
  const command = new Command("pwsh", ["/C", "ls"], {
    cwd,
  });

  console.log(await (await command.execute()).stdout);

  const stackFolders = await readDir("Projects", {
    dir: BaseDirectory.Home,
  });

  for (const stackFolder of stackFolders) {
    console.log(stackFolder);
  }
}
