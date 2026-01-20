import './App.css'
import {HeroUIProvider} from "@heroui/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom';
import { route } from '../router';
import { AuthContextProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();
function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}> 
    <HeroUIProvider>
       <AuthContextProvider>
          <RouterProvider router={route} /> {/* sends the application as prop to context */}
        </AuthContextProvider>
    </HeroUIProvider>
    <Toaster position="top-right" />
    </QueryClientProvider>
    </>
  )
}

export default App
