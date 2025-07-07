// src/App.jsx
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { SnackbarProvider } from "./component/event/SnackbarProvider ";
function App() {
  return (
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
}

export default App;
