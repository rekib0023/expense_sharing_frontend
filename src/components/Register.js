import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/auth/signup";

const Register = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState("");
  const [fNameFocus, setFNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lNameFocus, setLNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [confirmPwd, setConfirmPwd] = useState("");
  const [validConfirmPwd, setValidConfirmPwd] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidConfirmPwd(pwd === confirmPwd);
  }, [pwd, confirmPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd, confirmPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.access_token;
      setAuth({ firstName, lastName, email, pwd, accessToken });
      setFirstName("");
      setLastName("");
      setEmail("");
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
    <>
      <section>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setFirstName(e.target.value)}
            required
            onFocus={() => setFNameFocus(true)}
            onBlur={() => setFNameFocus(false)}
          />
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            autoComplete="off"
            onChange={(e) => setLastName(e.target.value)}
            required
            onFocus={() => setLNameFocus(true)}
            onBlur={() => setLNameFocus(false)}
          />
          <label htmlFor="email">
            Email:
            <FontAwesomeIcon
              icon={faCheck}
              className={validEmail ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validEmail || !email ? "hide" : "invalid"}
            />
          </label>
          <input
            type="text"
            id="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
          <p
            id="uidnote"
            className={
              emailFocus && email && !validEmail ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Enter a valid email address
          </p>
          <label htmlFor="password">
            Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPwd || !pwd ? "hide" : "invalid"}
            />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p
            id="pwdnote"
            className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>

          <label htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon
              icon={faCheck}
              className={validConfirmPwd && confirmPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validConfirmPwd || !confirmPwd ? "hide" : "invalid"}
            />
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setConfirmPwd(e.target.value)}
            value={confirmPwd}
            required
            aria-invalid={validConfirmPwd ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setConfirmPwdFocus(true)}
            onBlur={() => setConfirmPwdFocus(false)}
          />
          <p
            id="confirmnote"
            className={
              confirmPwdFocus && !validConfirmPwd ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
          <button
            disabled={
              !validEmail || !validPwd || !validConfirmPwd ? true : false
            }
          >
            Sign Up
          </button>
        </form>
        <p>
          Already registered?
          <br />
          <span className="line">
            <Link to="/login">Sign In</Link>
          </span>
        </p>
      </section>
    </>
  );
};

export default Register;
