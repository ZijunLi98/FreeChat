import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { emailverifyCheck } from "../../api/login";
import { toast } from "react-toastify";
import styles from "./EmailVerify.module.scss";
import { SiOpenai } from "react-icons/si";
import useErrorHandler from "../../hooks/useErrorHandler";

const EmailVerify = () => {
  const [isVerifying, setIsVerifying] = useState({
    status: true,
    message: "验证中，请稍后。。",
  });
  const { status } = isVerifying;
  const [countDown, setCountDown] = useState(5);
  const { verifyToken } = useParams();
  const navivate = useNavigate();
  const { catchAsync } = useErrorHandler();

  useEffect(() => {
    if (!status && countDown > 0) {
      setTimeout(function () {
        setCountDown((prevState) => prevState - 1);
      }, 1000);
    }
  }, [status, countDown]);

  useEffect(() => {
    catchAsync(async () => {
      try {
        const response = await emailverifyCheck(verifyToken);

        if (response.respCode === "001") {
          setIsVerifying({
            status: false,
            message: "恭喜，激活成功！",
          });
        }
        if (response.respCode === "100") {
          setIsVerifying({
            status: false,
            message: "激活邮件已过期,请重新注册!",
          });
        }
        setTimeout(() => {
          navivate("/");
        }, 5000);
      } catch (error) {
        toast.error("网络异常!", {
          theme: "colored",
        });
      }
    })();
  }, [verifyToken, navivate, catchAsync]);

  return (
    <div className={styles.PageWrapper}>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <div className={styles.logoContainer}>
            <SiOpenai />
          </div>
          <p>瞎聊</p>
        </div>
        <div className={styles.contentContainer}>
          <h1>{isVerifying.message}</h1>
          {!isVerifying.status && (
            <>
              <p>将于{countDown}s后返回登录页面。。。</p>
              <Link to="/">如无法自动跳转，点击此处返回登录页面</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
