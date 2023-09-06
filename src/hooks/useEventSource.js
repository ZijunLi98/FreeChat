import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import config from "../config/config";

export default function useEventSource({ setMessages, setIsReplying }) {
  const [eventSource, setEventSource] = useState(null);
  const { uuid } = useParams();
  const scrollRef = useRef([]);
  const [receivedMsg, setReceivedMsg] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("access_token");
    const source = new EventSource(
      `${config.apiAddress}/gpt/chatGptStream/${uuid}/${userToken}`
    );
    setEventSource(source);

    return () => {
      if (source) {
        source.close();
      }
    };
  }, [uuid]);

  useEffect(() => {
    if (!eventSource) return;

    eventSource.onmessage = function (event) {
      // console.log("Received event:", event.data);
      const response = JSON.parse(event.data);
      if (response.choices !== undefined) {
        const { delta } = response.choices[0];
        if (delta.content !== undefined) {
          // console.log("✨✨✨✨✨✨✨✨✨✨");
          let newContent = JSON.stringify(delta.content).slice(1, -1);
          setReceivedMsg((prevState) => prevState + newContent);

          const { scrollTop, clientHeight, scrollHeight } =
            scrollRef.current.parentNode;
          const roundedScrollTop = Math.round(scrollTop);
          const roundedClientHeight = Math.round(clientHeight);
          const roundedScrollHeight = Math.round(scrollHeight);
          const tolerance = 65;
          const isAtBottom =
            roundedScrollTop + roundedClientHeight + tolerance >=
            roundedScrollHeight;

          if (isAtBottom) {
            // 在这里执行滚动到底部时的操作
            scrollRef.current.parentNode.scrollTop =
              scrollRef.current.parentNode.scrollHeight -
              scrollRef.current.parentNode.clientHeight;
          }
          // }
        }
      }
    };
  }, [eventSource]);

  useEffect(() => {
    console.log("error close uef");
    if (!eventSource) return;
    eventSource.onerror = function (event) {
      console.log("error close: 🥓🥓🥓🥓🥓🥓🥓🥓🥓🥓🥓", event);
      eventSource.close();
      setMessages((prevState) => [
        ...prevState,
        {
          content: receivedMsg,
          role: "assistant",
        },
      ]);
      setIsReplying(false);
      // console.log(123);
      setReceivedMsg("");
    };
  }, [setMessages, setIsReplying, eventSource, receivedMsg]);

  return { receivedMsg, scrollRef };
}
