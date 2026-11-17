// import { useState } from 'react'

import ToastProvider from "./ContextProviders/UniversalToatProvider"
// import InfiniteScroll from "./InfiniteScroll/InfiniteScroll"
import KanbanBoard from "./KanbanBoard/KanbanBoard"
import './universal.css'

function App() {

  return (
    <ToastProvider>
    <KanbanBoard/>
    </ToastProvider>
  )
}

export default App
