import './App.css'
import { DEFAULT_THEME, MantineProvider } from '@mantine/core'
import Signup from './components/layouts/Signup/Signup.tsx'


function App() {

  return (
    <MantineProvider theme={DEFAULT_THEME} defaultColorScheme="dark">
      <Signup></Signup>
    </MantineProvider>
  )
}

export default App
