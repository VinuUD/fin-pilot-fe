import { Toaster } from 'react-hot-toast';
import React from "react";

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </>
  );
}

export default App;