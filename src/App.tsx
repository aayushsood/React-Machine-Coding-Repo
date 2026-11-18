// import { useState } from 'react'

import ToastProvider from "./ContextProviders/UniversalToatProvider";
import Theme from "./CustomHooksUsage/Theme";
// import InfiniteScroll from "./InfiniteScroll/InfiniteScroll"
// import KanbanBoard from "./KanbanBoard/KanbanBoard"
import "./universal.css";

function App() {
  return (
    <ToastProvider>
      <Theme />
    </ToastProvider>
  );
}

export default App;
