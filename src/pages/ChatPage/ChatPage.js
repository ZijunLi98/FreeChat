import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChatHistory, clearMemory } from "../../api/chat";
import styles from "./ChatPage.module.scss";
import ChatHeader from "./ChatHeader/ChatHeader";
import ChatContents from "./ChatContents/ChatContents";
import SendModule from "./SendModule/SendModule";
import useErrorHandler from "../../hooks/useErrorHandler";

function ChatPage() {
  const [isReplying, setIsReplying] = useState(false);
  const [title, setTitle] = useState("new chat");
  const [messages, setMessages] = useState([]);
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { catchAsync } = useErrorHandler();

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [navigate, isReplying]);

  useEffect(() => {
    catchAsync(async () => {
      const response = await getChatHistory(uuid);
      if (response.data.historyMessages !== null) {
        const orderedMessages = response.data.historyMessages.sort(
          (a, b) => a.createTime - b.createTime
        );
        setMessages(orderedMessages);
      } else {
        setMessages([]);
      }
      setTitle(response.data.title);
    })();
  }, [uuid, navigate, catchAsync]);

  const clearMemoryHandler = async () => {
    await clearMemory(uuid);
    setMessages([]);
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatContainer}>
        <ChatHeader
          title={title}
          onClear={clearMemoryHandler}
          catchAsync={catchAsync}
        />
        <main className={styles.chatMain}>
          <ChatContents
            isReplying={isReplying}
            messages={messages}
            setIsReplying={setIsReplying}
            setMessages={setMessages}
          />

          <SendModule
            isReplying={isReplying}
            setIsReplying={setIsReplying}
            setMessages={setMessages}
          />
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
