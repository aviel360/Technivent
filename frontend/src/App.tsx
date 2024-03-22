import './App.css'
import { MantineProvider } from '@mantine/core'
import Home from './components/layouts/home/Home.tsx'

function App() {

  return (
    <MantineProvider defaultColorScheme="dark">
      <Home></Home>
    </MantineProvider>
  )
}

export default App
