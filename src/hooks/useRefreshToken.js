import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accces_token);
      return { ...prev, acccesToken: response.data.accces_token };
    });
    return response.data.accces_token;
  };
  return refresh;
};

export default useRefreshToken;
