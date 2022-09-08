import Login from "./Login";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> </Route>
    </Routes>
  );
};

export default App;
