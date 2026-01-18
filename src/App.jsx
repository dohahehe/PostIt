import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {HeroUIProvider} from "@heroui/react";
import {Button} from "@heroui/button";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();
function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}> 
    <HeroUIProvider>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Button color="primary">Button</Button>
      </div>
    </HeroUIProvider>
    </QueryClientProvider>
    </>
  )
}

export default App
