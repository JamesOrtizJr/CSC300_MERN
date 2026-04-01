import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";
import { UserContext } from "../../App";

const PRIMARY_COLOR = "#cc5c99";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const setUser = userContext?.setUser;

  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");

  const navigate = useNavigate();

  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
  };

  const backgroundStyling = { background: bgColor };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: bgColor,
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (light) {
      setBgColor("white");
      setBgText("Dark mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light mode");
    }
  }, [light]);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;

      localStorage.setItem("accessToken", accessToken);

      if (setUser) {
        setUser(getUserInfo());
      }

      navigate("/home");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        if (error.response.status === 403) {
          setError("Account is banned");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div
            className="row d-flex justify-content-center align-items-center h-100"
            style={backgroundStyling}
          >
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label style={labelStyling}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                  />
                  <Form.Text className="text-muted">
                    We just might sell your data
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label style={labelStyling}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={data.password}
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Text className="text-muted pt-1">
                    Dont have an account?
                    <span>
                      <Link to="/signup" style={labelStyling}>
                        {" "}Sign up
                      </Link>
                    </span>
                  </Form.Text>
                </Form.Group>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    onChange={() => setLight(!light)}
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {bgText}
                  </label>
                </div>

                {error && (
                  <div style={labelStyling} className="pt-3">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  style={buttonStyling}
                  className="mt-2"
                >
                  Log In
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;