import { NavLink, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import styles from "./NavChatItem.module.scss";
import {
  RiMessage3Line,
  RiDeleteBin3Line,
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
} from "react-icons/ri";
import { deleteChat, renameChat } from "../../../api/chat";
import useErrorHandler from "../../../hooks/useErrorHandler";

function NavChatItem({ uuid, title, onClose, userDispatch }) {
  const chatRef = useRef();
  const renameRef = useRef();
  const { catchAsync } = useErrorHandler();
  const [checkStatus, setCheckStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const { uuid: currentChatId } = useParams();

  const confirmHandler = catchAsync(async () => {
    const uuid = chatRef.current.id;
    setIsDisabled(true);
    if (checkStatus === "delete") {
      if (uuid === currentChatId) {
        toast.error("无法删除当前聊天室！", {
          theme: "colored",
        });
        return;
      }

      const response = await deleteChat(uuid);
      if (response.respCode === "001") {
        userDispatch({ type: "deleteChat", chatId: uuid });
        toast.success("成功删除该聊天！", {
          theme: "colored",
        });
      }
      setIsDisabled(false);
    }

    if (checkStatus === "rename") {
      const renameTitle = renameRef.current.value;
      if (renameTitle === title) {
        setCheckStatus("");
        return;
      }

      if (renameTitle.length < 1) {
        toast.error("聊天名长度最少为1！", {
          theme: "colored",
        });
        setIsDisabled(false);
        return;
      }

      const response = await renameChat({
        uuid,
        title: renameTitle,
      });

      if (response.respCode === "001") {
        userDispatch({
          type: "renameChat",
          chatId: uuid,
          newTitle: renameTitle,
        });
        toast.success("已成功修改聊天名！", {
          theme: "colored",
        });
        setCheckStatus("");
      }
      setIsDisabled(false);
    }
  });

  const handleClick = (event) => {
    if (event.target.tagName !== "INPUT") {
      onClose();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <NavLink
        to={`/chat/${uuid}`}
        className={({ isActive }) =>
          isActive ? `${styles.chats} ${styles.isActive}` : styles.chats
        }
        ref={chatRef}
        onClick={handleClick}
        id={uuid}
      >
        {checkStatus === "delete" ? (
          <RiDeleteBin3Line />
        ) : checkStatus === "rename" ? (
          <RiEditLine />
        ) : (
          <RiMessage3Line />
        )}

        <span>
          {checkStatus === "delete" ? (
            "确定删除？"
          ) : checkStatus === "rename" ? (
            <input
              ref={renameRef}
              defaultValue={title}
              type="text"
              required
              minLength={3}
              className={styles.renameInput}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation(); // 阻止事件冒泡
              }}
            />
          ) : (
            title
          )}
        </span>
      </NavLink>
      {uuid !== currentChatId && (
        <div className={styles.manageBtns}>
          {checkStatus === "" && (
            <>
              <button
                className={styles.renameBtn}
                onClick={() => setCheckStatus("rename")}
              >
                <RiEditLine />
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => setCheckStatus("delete")}
              >
                <RiDeleteBin3Line />
              </button>
            </>
          )}
          {checkStatus !== "" && (
            <>
              <button
                className={styles.confirmBtn}
                onClick={confirmHandler}
                disabled={isDisabled}
              >
                <RiCheckLine />
              </button>
              <button
                className={styles.closeBtn}
                onClick={() => setCheckStatus("")}
              >
                <RiCloseLine />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NavChatItem;
