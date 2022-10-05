import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useToggle from "../hooks/useToggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: <i className="fi fi-rr-home"></i> },
  {
    name: "Groups",
    href: "/admin",
    icon: <i class="fi fi-rr-users-alt"></i>,
  },
  {
    name: "Expenses",
    href: "/expenses",
    icon: <i className="fi fi-rr-sack-dollar"></i>,
  },
];

function Sidebar() {
  const [navOpen, toggleNavOpen] = useToggle("navOpen", false);
  console.log(navOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const activeClass = "bg-gray-500 bg-opacity-30";

  return (
    <div
      className={`bg-dark-purple h-screen p-5 pt-8 ${
        navOpen ? "w-72" : "w-20"
      } duration-200`}
    >
      <div
        className="flex space-x-2 mb-6 cursor-pointer"
        onClick={() => toggleNavOpen(!navOpen)}
      >
        <div className="text-white pl-3 text-2xl">
          <i class="fi fi-rr-file-invoice-dollar"></i>
        </div>
        <div className={`text-white text-2xl font-semibold duration-300`}>
          {navOpen && "Expense Tracker"}
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={`font-medium rounded-md border border-transparent text-white p-3 hover:bg-gray-500 hover:bg-opacity-30 ${
              location.pathname === item.href && activeClass
            }`}
          >
            <span className="pr-2">{item.icon}</span>
            {navOpen && item.name}
          </NavLink>
        ))}
        <a
          onClick={signOut}
          className="cursor-pointer font-medium rounded-md border border-transparent text-white p-3 hover:bg-gray-500 hover:bg-opacity-30"
        >
          <span className="pr-2">
            <i className="fi fi-rr-exit"></i>
          </span>
          {navOpen && "Sign Out"}
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
