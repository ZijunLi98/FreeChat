import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../../pages/LoginPage/LoginPage.module.scss";
import { SiOpenai } from "react-icons/si";
import { setNewPassword } from "../../api/login";
import { toast } from "react-toastify";
import useErrorHandler from "../../hooks/useErrorHandler";

function ResetPassword() {
  const [countDown, setCountDown] = useState(3);
  const [newPwd, setNewPwd] = useState("");
  const [isVerification, setIsVerification] = useState(false);
  const { catchAsync } = useErrorHandler();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const { verifyToken } = useParams();
  const navivate = useNavigate();

  useEffect(() => {
    if (isVerification && countDown > 0) {
      setTimeout(function () {
        setCountDown((prevState) => prevState - 1);
      }, 1000);
    }
  }, [isVerification, countDown]);

  const onSubmitHandler = catchAsync(async (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    const response = await setNewPassword({ pwd: newPwd }, verifyToken);
    if (response.respCode === "001") {
      setIsVerification(true);
      setTimeout(() => {
        navivate("/");
      }, 3000);
      return;
    }
    if (response.respCode === "102") {
      toast.error("该用户不存在，请前往注册！", { theme: "colored" });
    }
    setBtnDisabled(false);
  });
  return (
    <div className={styles.PageWrapper}>
      <div className={styles.titleContainer}>
        <div className={styles.logoContainer}>
          <SiOpenai />
        </div>
        <h1>请输入新密码</h1>
      </div>
      <form className={styles.loginForm} onSubmit={onSubmitHandler}>
        <div className={styles.mainLoginContainer}>
          <div className={styles.fieldWrapper}>
            <label htmlFor="password-input">
              密码 <span>*</span>
            </label>
            <input
              id="password-input"
              type="text"
              name="text"
              value={newPwd}
              minLength={6}
              onChange={(e) => {
                setNewPwd(e.target.value);
              }}
              placeholder="请输入新密码"
              required
            />
          </div>
          <button
            className={styles.loginBtn}
            disabled={newPwd.length < 6 || btnDisabled}
          >
            确认
          </button>
        </div>
      </form>
      {isVerification && (
        <div className={styles.messageWrapper}>
          <div className={styles.messageContainer}>
            <h1>恭喜您，已成功修改密码！</h1>
            <p>将于{countDown}s后返回登录页面。。。</p>
            <Link to="/">如无法自动跳转，点击此处返回登录页面</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
