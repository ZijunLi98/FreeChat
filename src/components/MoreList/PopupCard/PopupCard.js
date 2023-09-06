import { useState, useEffect } from "react";
import styles from "./PopupCard.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import { createNewChat } from "../../../api/chat";
import { topup, getCurrentBalance } from "../../../api/topup";
import { toast } from "react-toastify";
import useErrorHandler from "../../../hooks/useErrorHandler";

function PopupCard({ status, onClose, userDispatch }) {
  const [input, setInput] = useState(status === "newChat" ? "new chat" : "");
  const [isLoading, setIsLoading] = useState(false);
  const { catchAsync } = useErrorHandler();
  const [balance, setBalance] = useState("加载中");

  const onCloseHandler = () => {
    onClose("");
  };

  const newChatHandler = catchAsync(async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await createNewChat(input);
    if (response.respCode === "001") {
      userDispatch({ type: "addNewChat", chat: response.data });
      toast.success("成功创建新聊天，可通过导航栏切换聊天！", {
        theme: "colored",
      });
      onClose("");
    }
    setIsLoading(false);
  });

  const topupHandler = catchAsync(async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await topup(input);
    if (response.respCode === "106") {
      toast.error("验证码已过期或已失效！", {
        theme: "colored",
      });
    }
    if (response.respCode === "001") {
      toast.success("成功充值，谢谢支持！", {
        theme: "colored",
      });
      onClose("");
    }
    setIsLoading(false);
  });

  useEffect(() => {
    if (status === "topup") {
      catchAsync(async () => {
        const response = await getCurrentBalance();
        setBalance(response.data.balance);
      })();
    }
  }, [status, catchAsync]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgCover} />
      <div className={styles.cardWrapper}>
        <div className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <span>{status === "topup" ? "充值" : "新建聊天"}</span>
            <div onClick={onCloseHandler} className={styles.closeBtn}>
              <AiOutlineClose />
            </div>
          </div>
          <div className={styles.cardMain}>
            <form>
              {status === "topup" && <label>当前余额： {balance}</label>}
              <input
                id="input"
                type="text"
                placeholder={status === "topup" ? "请输入16位激活码" : ""}
                value={input}
                maxLength={16}
                onChange={(e) => setInput(e.target.value)}
                required
              ></input>

              {status === "topup" ? (
                <button
                  disabled={input.length !== 16 || isLoading}
                  onClick={topupHandler}
                >
                  提交验证码
                </button>
              ) : (
                <button
                  disabled={input.length < 1 || isLoading}
                  onClick={newChatHandler}
                >
                  确认
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupCard;
