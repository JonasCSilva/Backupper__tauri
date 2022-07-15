import { Button, Checkbox, Group, Loader, Table } from '@mantine/core'
import { relaunch } from '@tauri-apps/api/process'

import '../styles/App.css'

import useProjectStatus from '../hooks/useProjectsStatus'

export default function App() {
  const projectsStatus = useProjectStatus()

  return (
    <div className='App'>
      <header className='App-header'>
        <Group>
          <Button onClick={async () => await relaunch()}>Test</Button>
        </Group>
      </header>
      <div id='main'>
        {projectsStatus.length ? (
          <Table>
            <thead>
              <tr>
                <th>Project Path</th>
                <th>Project Folder</th>
                <th>Project Name</th>
                <th>Git Repository</th>
                <th>Git Uncommitted</th>
              </tr>
            </thead>
            <tbody>
              {projectsStatus.map((element, index) => (
                <tr key={index}>
                  <td>{element.path}</td>
                  <td>{element.folder}</td>
                  <td>{element.name}</td>
                  <td>
                    <Checkbox readOnly checked={element.gitRepository} />
                  </td>
                  <td>
                    <Checkbox readOnly checked={element.gitUncommitted} color='orange' />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div id='loaderContainer'>
            <Loader id='loader' />
          </div>
        )}
      </div>
    </div>
  )
}
