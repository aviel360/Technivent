import './App.css'
import { MantineProvider } from '@mantine/core'
import Main from './components/layouts/main/Main.tsx'

function App() {

  return (
    <MantineProvider defaultColorScheme="auto">
      <Main></Main>
    </MantineProvider>
  )
}

export default App
