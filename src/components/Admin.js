import SidebarLayout from "../pages/SidebarLayout";
import User from "./User";

const Admin = () => {
  return (
    <SidebarLayout>
      <h1>Admin</h1>
      <User />
    </SidebarLayout>
  );
};

export default Admin;
