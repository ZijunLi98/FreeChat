import styles from "./ChatItem.module.scss";
import { SiOpenai } from "react-icons/si";
import { BiUser } from "react-icons/bi";
import ChatContent from "./ChatContent/ChatContent";
import useEventSource from "../../../hooks/useEventSource";

const CurrentChatItem = ({ role, setMessages, setIsReplying }) => {
  const isUser = role === "user";
  const { receivedMsg, scrollRef } = useEventSource({
    setMessages,
    setIsReplying,
  });
  const replacedMsg = receivedMsg.replace(/\\n/g, "\n");

  return (
    <div
      className={`${styles.itemWrapper} ${!isUser && styles.isUser}`}
      ref={scrollRef}
    >
      <div className={styles.itemContainer}>
        <div className={styles.iconContainer}>
          <div className={`${styles.container} ${isUser && styles.isUser}`}>
            {isUser ? <BiUser /> : <SiOpenai />}
          </div>
        </div>
        <div
          className={styles.contentContainer}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {receivedMsg === "" ? (
            "Replying..."
          ) : (
            <ChatContent line={replacedMsg} />
          )}
        </div>
      </div>
    </div>
  );
};
export default CurrentChatItem;
