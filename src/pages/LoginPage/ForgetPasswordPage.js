import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { SiOpenai } from "react-icons/si";
import { forgetPassword } from "../../api/login";
import { toast } from "react-toastify";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import useErrorHandler from "../../hooks/useErrorHandler";

function ForgetPasswordPage() {
  const [isVerification, setIsVerification] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const { catchAsync } = useErrorHandler();

  const onSubmitHandler = catchAsync(async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    const response = await forgetPassword(email);
    if (response.respCode === "001") {
      setIsVerification(true);
      return;
    }

    if (response.respCode === "102") {
      toast.error("该用户不存在，请前往注册！", { theme: "colored" });
      setBtnDisabled(false);
    }
  });

  return (
    <div className={styles.PageWrapper}>
      <div className={styles.returnContainer}>
        <Link className={styles.returnBtn} to="/">
          <MdOutlineKeyboardArrowLeft />
          返回
        </Link>
      </div>
      <div className={styles.titleContainer}>
        <div className={styles.logoContainer}>
          <SiOpenai />
        </div>
        <h1>找回密码</h1>
      </div>
      <form className={styles.loginForm} onSubmit={onSubmitHandler}>
        <div className={styles.mainLoginContainer}>
          <div className={styles.fieldWrapper}>
            <label htmlFor="password-input">
              邮箱 <span>*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="请输入邮箱地址"
              required
            />
          </div>
        </div>
        <button
          className={styles.loginBtn}
          disabled={!isValidEmail || btnDisabled}
        >
          发送邮件
        </button>
      </form>
      {isVerification && (
        <div className={styles.messageWrapper}>
          <div className={styles.messageContainer}>
            <h1>已向您的邮箱发送验证邮件</h1>
            <p>我们已经给您的邮箱发送了一个验证邮件，以帮助您更改密码。</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgetPasswordPage;
