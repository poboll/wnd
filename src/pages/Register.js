import React from "react";
import { useForm } from "react-hook-form";
import axios from "commons/axios";
import { toast } from "react-toastify";

export default function Register(props) {
  //
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    // 3.註冊判斷
    try {
      const { nickname, email, password } = data;
      const res = await axios.post("/auth/register", {
        nickname,
        email,
        password,
        type: 0,
      });
      const jwToken = res.data;
      global.auth.setToken(jwToken);
      toast.success("Register Success");
      props.history.push("/");
    } catch (error) {
      const message = error.response.data;
      toast.error(message);
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <form className="box login-box" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label className="label">Nickname</label>
            <div className="control">
              <input
                className={`input ${errors.nickname && "is-danger"}`}
                type="text"
                placeholder="nickname"
                name="nickname"
                ref={register({
                  required: "nickname is required",
                })}
              />
              {errors.nickname && (
                <p className="helper has-text-danger">
                  {errors.nickname.message}
                </p>
              )}
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className={`input ${errors.email && "is-danger"}`}
                type="text"
                placeholder="Email"
                name="email"
                ref={register({
                  required: "email is required",
                  pattern: {
                    value: /^[A-Za-z0-9]+([_\\.][A-Za-z0-9]+)*@([A-Za-z0-9\\-]+\.)+[A-Za-z]{2,6}$/,
                    message: "invalid email",
                  },
                })}
              />
              {errors.email && (
                <p className="helper has-text-danger">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className={`input ${errors.password && "is-danger"}`}
                type="text"
                placeholder="Password"
                name="password"
                ref={register({
                  required: "password is required",
                  minLength: {
                    value: 6,
                    message: "cannot be less than 6 digits",
                  },
                })}
              />
              {errors.password && (
                <p className="helper has-text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="control">
            <button className="button is-fullwidth is-primary">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}
