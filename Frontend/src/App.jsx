import { RouterProvider } from "react-router-dom";
import { router } from './app.routes'
import { AuthProvider } from "./features/auth/auth.context";
import { SongProvider } from "./features/home/song.context";


function App() {
  return (
    <SongProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </SongProvider>
  );
}

export default App;