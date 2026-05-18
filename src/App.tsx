// import { useState } from 'react'

import ToastProvider from "./ContextProviders/UniversalToatProvider"
import InfiniteScroll from "./InfiniteScroll/InfiniteScroll"
import './universal.css'

function App() {

  return (
    <ToastProvider>
    <InfiniteScroll/>
    </ToastProvider>
  )
}

export default App
