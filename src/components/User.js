import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/user/all", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (error) {
        console.log(error);
        navigate("/login", { state: { form: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.first_name}</li>
          ))}
        </ul>
      ) : (
        <p>No Users to display</p>
      )}
    </article>
  );
};

export default User;
