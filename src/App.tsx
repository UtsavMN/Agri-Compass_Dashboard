import { SmoothScrollProvider } from "./providers/SmoothScrollProvider";
import { Home } from "./pages/Home";

function App() {
  return (
    <SmoothScrollProvider>
      <Home />
    </SmoothScrollProvider>
  );
}

export default App;
