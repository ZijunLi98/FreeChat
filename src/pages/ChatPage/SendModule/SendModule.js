import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BsSend, BsFillStopFill } from "react-icons/bs";
import styles from "./SendModule.module.scss";
import { sendMessage, stopResponse } from "../../../api/chat";
import useErrorHandler from "../../../hooks/useErrorHandler";

function SendModule({ isReplying, setIsReplying, setMessages }) {
  const [value, setValue] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const textAreaRef = useRef();
  const { current } = textAreaRef;
  const { uuid } = useParams();
  const { catchAsync } = useErrorHandler();
  console.log(isReplying);

  useEffect(() => {
    if (current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      current.style.height = "0px";
      const scrollHeight = current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      current.style.height = scrollHeight + "px";
    }
  }, [current, value]);

  const rowNumHandler = (e) => {
    const value = e.target?.value;
    setValue(value);
  };

  const stopResponseHandler = catchAsync(async () => {
    await stopResponse(uuid);
    console.log("🎃🎃🎃🎃🎃🎃🎃🎃🎃🎃🎃");
    console.log("stop");
  });

  const sendHandler = catchAsync(async (event) => {
    event.preventDefault();
    if (value !== "") {
      setIsDisable(true);
      const data = { uuid, message: value };
      try {
        const response = await sendMessage(data);

        if (response.respCode === "108") {
          toast.error("用户余额不足，请使用激活码充值~~", { theme: "colored" });
          return;
        }
        if (response.respCode === "112") {
          toast.error("单条消息内容超过系统上线！", { theme: "colored" });
          return;
        }

        setMessages((prevState) => {
          return [
            ...prevState,
            {
              content: value,
              role: "user",
            },
          ];
        });
        setIsReplying(true);
        setValue("");
      } finally {
        setIsDisable(false);
      }
    }
  });

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.ctrlKey) {
      if (!isDisable && !isReplying) {
        sendHandler(event);
      } else {
        event.preventDefault();
      }
    }
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      const value = event.target?.value;
      setValue(value + "\n");
    }
  }

  return (
    <div className={styles.formContainer}>
      <form
        className={styles.sendForm}
        onSubmit={sendHandler}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.inputWrapper}>
          <div className={styles.inputContainer}>
            <textarea
              className={styles.inputArea}
              tabIndex={0}
              ref={textAreaRef}
              placeholder="回复不完整可发送：继续..."
              value={value}
              onChange={rowNumHandler}
            ></textarea>
            <button
              className={styles.sendBtn}
              disabled={isDisable || isReplying}
            >
              <BsSend />
            </button>
          </div>
          {isReplying && (
            <div className={styles.moreContainer}>
              <button className={styles.pauseBtn} onClick={stopResponseHandler}>
                <BsFillStopFill />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SendModule;
