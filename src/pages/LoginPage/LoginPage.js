import { useEffect, useState, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { UserContext } from "../../contexts/UserContext";
import { SiOpenai } from "react-icons/si";
import { login, signup } from "../../api/login";
import { toast } from "react-toastify";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { createNewChat } from "../../api/chat";
import useErrorHandler from "../../hooks/useErrorHandler";

function LoginPage() {
  const [email, setEmail] = useState("");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const [password, setPassword] = useState("");
  const [isVerification, setIsVerification] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const inviteCodeRef = useRef();
  const { catchAsync } = useErrorHandler();

  const navivate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const userContext = useContext(UserContext);
  const { userDispatch } = userContext;

  useEffect(() => {
    setEmail("");
    setPassword("");
    setIsVerification(false);
    setBtnDisabled(false);
  }, [pathname]);

  const onSubmitHandler = catchAsync(async (e) => {
    e.preventDefault();
    setBtnDisabled(true);

    const data = {
      email,
      pwd: password,
    };
    try {
      if (pathname === "/signup") {
        if (inviteCodeRef.current.value) {
          data.inviteCode = inviteCodeRef.current.value;
        }
        const response = await signup(data);
        if (response.respCode === "001" || response.respCode === "104") {
          setIsVerification(true);
          setEmail("");
          setPassword("");
          return;
        }
        if (response.respCode === "101") {
          toast.error("该邮箱已存在！", { theme: "colored" });
        }
      } else if (pathname === "/") {
        const response = await login(data);

        if (response.respCode === "102") {
          toast.error("邮箱或密码错误！", { theme: "colored" });
          setBtnDisabled(false);
          return;
        }

        if (response.respCode === "001") {
          const { user, token } = response.data;
          localStorage.setItem("access_token", token);
          let orderedList = [];
          if (user.chatList !== null) {
            orderedList = user?.chatList.sort(
              (a, b) => b.lastMsgSendTime - a.lastMsgSendTime
            );
          } else {
            const response = await createNewChat();
            orderedList.push(response.data);
          }
          userDispatch({
            type: "init",
            init: {
              balance: user.balance,
              chatList: orderedList,
              inviteCode: user.inviteCode,
            },
          });

          const initUuid = orderedList[0].uuid;
          navivate(`/chat/${initUuid}`);
        }
      }
    } finally {
      setBtnDisabled(false);
    }
  });

  return (
    <div className={styles.PageWrapper}>
      {pathname === "/signup" && (
        <div className={styles.returnContainer}>
          <Link className={styles.returnBtn} to="/">
            <MdOutlineKeyboardArrowLeft />
            返回
          </Link>
        </div>
      )}
      <div className={styles.titleContainer}>
        <div className={styles.logoContainer}>
          <SiOpenai />
        </div>
        <h1>{pathname === "/signup" ? "注册账户" : "欢迎使用 瞎聊"}</h1>
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
              autoComplete={pathname === "/signup" ? "off" : "username"}
              placeholder="请输入邮箱地址"
              required
            />
          </div>
          <div className={styles.fieldWrapper}>
            <label htmlFor="password-input">
              密码 <span>*</span>
            </label>
            <input
              id="password-input"
              type="password"
              name="password"
              value={password}
              minLength={6}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete={pathname === "/signup" ? "off" : "current-password"}
              placeholder="请输入密码"
              required
            />
          </div>
          {pathname === "/signup" && (
            <div className={styles.fieldWrapper}>
              <label htmlFor="password-input">邀请码</label>
              <input
                id="inviteCode-input"
                type="text"
                name="inviteCode"
                minLength={8}
                maxLength={8}
                placeholder="请输入邀请码 (选填)"
                ref={inviteCodeRef}
              />
            </div>
          )}
        </div>
        <button
          className={styles.loginBtn}
          disabled={!isValidEmail || password.length < 6 || btnDisabled}
        >
          {pathname === "/signup" ? "注册账号" : "登录"}
        </button>
        {pathname === "/" && (
          <div className={styles.footerContainer}>
            <Link className={styles.forgetPassword} to="/forgetPassword">
              忘记密码
            </Link>
            <Link className={styles.register} to="/signup">
              注册账号
            </Link>
          </div>
        )}
      </form>
      {isVerification && (
        <div className={styles.messageWrapper}>
          <div className={styles.messageContainer}>
            <h1>邮箱认证以激活账号</h1>
            <p>我们已经给您的邮箱发送了一个认证邮件，请前往邮箱并进行激活。</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
