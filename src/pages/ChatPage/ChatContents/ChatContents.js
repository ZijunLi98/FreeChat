import { useEffect, useRef, useState } from "react";

import styles from "./ChatContents.module.scss";
import ChatItem from "../ChatItem/ChatItem";
import CurrentChatItem from "../ChatItem/CurrentChatItem";

function ChatContents({ messages, isReplying, setMessages, setIsReplying }) {
  const [firstRender, setFirstRender] = useState(true);
  const scrollRef = useRef([]);

  // 自动scroll
  useEffect(() => {
    if (firstRender) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      setFirstRender(false);
    } else {
      if (scrollRef.current.lastChild) {
        scrollRef.current.lastChild.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [messages, firstRender]);

  return (
    <div className={styles.contentContainer} ref={scrollRef}>
      {messages.map((el, i) => (
        <ChatItem content={el.content} role={el.role} key={`M-${i}`} />
      ))}
      {isReplying && (
        <CurrentChatItem
          role="assistant"
          setMessages={setMessages}
          setIsReplying={setIsReplying}
        />
      )}
      <div className={styles.emptyContent} />
    </div>
  );
}

export default ChatContents;
