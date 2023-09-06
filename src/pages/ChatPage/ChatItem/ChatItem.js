import styles from "./ChatItem.module.scss";
import { SiOpenai } from "react-icons/si";
import { BiUser } from "react-icons/bi";
import ChatContent from "./ChatContent/ChatContent";

function ChatItem({ content, role }) {
  const isUser = role === "user";
  content = content.replace(/\\n/g, "\n");
  return (
    <div className={`${styles.itemWrapper} ${!isUser && styles.isUser}`}>
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
          <ChatContent line={content} />
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
