import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styles from "./ChatContent.module.scss";
import CodingBlock from "./CodingBlock/CodingBlock";

const renderCode = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline ? (
    <CodingBlock
      language={match ? match[1] : `javascript`}
      content={String(children).replace(/\n$/, "")}
    />
  ) : (
    <code className={className}>{children}</code>
  );
};

function ChatContent({ line }) {
  return (
    <div className={styles.tableContainer}>
      <ReactMarkdown
        children={line}
        components={{
          code: renderCode,
        }}
        remarkPlugins={[gfm]}
      />
    </div>
  );
}

export default ChatContent;
