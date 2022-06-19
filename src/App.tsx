import { Table } from '@mantine/core'

import './App.css'

import useProjectStatus from './useProjectsStatus'

function App() {
  const projectsStatus = useProjectStatus()

  return (
    <div className='App'>
      {/* <header className='App-header'>
        <Group>
          <Button onClick={async () => await checkProjects()}>Test</Button>
        </Group>
      </header> */}
      <main>
        <Table>
          <thead>
            <tr>
              <th>Project Path</th>
              <th>Project Folder</th>
              <th>Project Name</th>
            </tr>
          </thead>
          <tbody>
            {projectsStatus.map((element, index) => (
              <tr key={index}>
                <td>{element.path}</td>
                <td>{element.folder}</td>
                <td>{element.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </main>
    </div>
  )
}

export default App
