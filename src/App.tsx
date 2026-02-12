import { Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Examples } from "./pages/Examples";
import { Research } from "./pages/Research";
import { ExampleViewer } from "./pages/ExampleViewer";
import { ShareNeccBriefPage } from "./pages/ShareNeccBriefPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/examples" element={<Examples />} />
      <Route path="/examples/:id" element={<ExampleViewer />} />
      <Route path="/research" element={<Research />} />
      <Route
        path="/share/necc-circular-construction-brief"
        element={<ShareNeccBriefPage />}
      />
    </Routes>
  );
}
