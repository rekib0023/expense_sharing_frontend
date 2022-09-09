import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Login from "./components/Login";
import Register from "./components/Register";
import LinkPage from "./components/LinkPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;
