import Prism from "prismjs";
import { useEffect, memo } from "react";
// chema
import "prismjs/themes/prism-tomorrow.css";

// languages
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-css-extras";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-scala";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-http";
import "prismjs/components/prism-cshtml";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";

// toobar
import "prismjs/plugins/toolbar/prism-toolbar";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";

// plugins
import "prismjs/plugins/previewers/prism-previewers";
import "prismjs/plugins/previewers/prism-previewers.css";
// 未生效
import "prismjs/plugins/inline-color/prism-inline-color";
import "prismjs/plugins/inline-color/prism-inline-color.css";

const CodingBlock = memo(({ language, content }) => {
  content = content
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\");

  useEffect(() => {
    Prism.highlightAll();
  }, [content, language]);
  return (
    <div>
      <pre className={`language-${language}`}>
        <code className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  );
});

export default CodingBlock;
