import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
        {/* <Navbar /> Empty tag */}
        <Navbar>
          <h1>Hello</h1>
        </Navbar> {/* Nested tag to pass data to component */}
        <main className='min-h-screen bg-gray-200 flex justify-center'>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Layout