import { ChakraProvider, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import Route from './Route';
import Dashboard from './Dashboard';
import WhistStartForm from './WhistStartForm';
import RentzStartForm from './RentzStartForm';
import { useEffect, useState } from 'react';
import { RentzContextProvider } from './context/RentzContext';
import RentzInProgress from './RentzInProgress';
import Header from './Header';


const { Button, Input, Modal, Checkbox, Menu } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button,
    Input,
    Modal,
    Checkbox,
    Menu
  },
})

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('popstate', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange)
    };
  });


  return (
    <ChakraProvider theme={theme}>
      <div>
        <RentzContextProvider>
          <Header />
          <Route path='/' currentPath={currentPath} component={<Dashboard />} />
          <Route path='/whist' currentPath={currentPath} component={<WhistStartForm />} />
          <Route path='/rentz' currentPath={currentPath} component={<RentzStartForm />} />
          <Route path='/rentz/game-in-progress' currentPath={currentPath} component={<RentzInProgress />} />
        </RentzContextProvider>
      </div>
    </ChakraProvider>
  );
}

export default App;
