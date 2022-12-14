import Sidebar from "../components/Sidebar";

const SidebarLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <section className="p-6 w-full">{children}</section>
    </div>
  );
};

export default SidebarLayout;
