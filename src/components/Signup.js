import { useState, useEffect, useRef } from "react";
import { signupFields } from "../constants/formFields";
import useInput from "../hooks/useInput";
import FormAction from "./FormAction";
import Input from "./Input";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/auth/signup";

export default function Signup() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const errRef = useRef();

  const [firstName, resetFirstName, firstNameAttribs] = useInput(
    "firstName",
    ""
  );
  const [lastName, resetLastName, lastNameAttribs] = useInput("lastName", "");
  const [email, resetEmail, emailAttribs] = useInput("email", "");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  fields[0]["fieldAttribs"] = firstNameAttribs;
  fields[1]["fieldAttribs"] = lastNameAttribs;
  fields[2]["fieldAttribs"] = emailAttribs;
  fields[3]["fieldAttribs"] = {
    value: pwd,
    handleChange: (e) => setPwd(e.target.value),
  };
  fields[4]["fieldAttribs"] = {
    value: confirmPwd,
    handleChange: (e) => setConfirmPwd(e.target.value),
  };

  const [validPwd, setValidPwd] = useState(false);
  const [validConfirmPwd, setValidConfirmPwd] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidConfirmPwd(pwd === confirmPwd);
  }, [pwd, confirmPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd, confirmPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.access_token;
      setAuth({ firstName, lastName, email, accessToken });
      resetFirstName();
      resetLastName();
      resetEmail();
      setPwd("");
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 409) {
        setErrMsg("User with this email already exist");
      } else {
        setErrMsg("Registration Failed");
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
        <div className="">
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
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        </div>
      </form>
    </section>
  );
}
