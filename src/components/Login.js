import { useRef, useState, useEffect } from "react";
import { loginFields } from "../constants/formFields";
import useAuth from "../hooks/useAuth";
import useInput from "../hooks/useInput";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

const LOGIN_URL = "/auth/login";

export default function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const errRef = useRef();

  const [email, resetEmail, emailAttribs] = useInput("email", "");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  fields[0]["fieldAttribs"] = emailAttribs;
  fields[1]["fieldAttribs"] = {
    value: pwd,
    handleChange: (e) => setPwd(e.target.value),
  };

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          email: email,
          password: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.access_token;
      setAuth({ email, accessToken });
      resetEmail();
      setPwd("");
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error.response);
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.data?.detail) {
        setErrMsg(error.response?.data?.detail);
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offScreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
          {fields.map((field) => (
            <Input
              key={field.id}
              {...field.fieldAttribs}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
        </div>

        <FormExtra />
        <FormAction handleSubmit={handleSubmit} text="Login" />
      </form>
    </section>
  );
}
