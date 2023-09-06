import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ChatHeader.module.scss";
import { BsList } from "react-icons/bs";
import { BiReset } from "react-icons/bi";
import MoreList from "../../../components/MoreList/MoreList";
import { RiCheckLine, RiCloseLine } from "react-icons/ri";

function ChatHeader({ title, onClear, catchAsync }) {
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [checkReset, setCheckReset] = useState(false);

  const toggleMoreHandler = () => {
    setIsOpenMore((prevState) => {
      return !prevState;
    });
  };

  const clearMemoryHandler = catchAsync(async () => {
    setCheckReset(false);
    setIsClearing(true);
    await onClear();
    setIsClearing(false);
  });

  return (
    <>
      <div className={styles.chatHeader}>
        <button onClick={toggleMoreHandler}>
          <BsList />
        </button>
        <h1 className={checkReset ? styles.checkReset : ""}>
          {checkReset ? "确认清空当前聊天？" : title}
        </h1>
        {!checkReset && (
          <button
            onClick={() => setCheckReset(true)}
            disabled={isClearing}
            className={styles.memoryBtn}
          >
            <BiReset />
          </button>
        )}
        {checkReset && (
          <>
            <button className={styles.confirmBtn} onClick={clearMemoryHandler}>
              <RiCheckLine />
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => setCheckReset(false)}
            >
              <RiCloseLine />
            </button>
          </>
        )}
      </div>
      {isOpenMore &&
        createPortal(
          <MoreList onClose={toggleMoreHandler} />,
          document.getElementById("navigation")
        )}
    </>
  );
}

export default ChatHeader;
