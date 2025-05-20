import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ImageGrid from "./ImageGrid/ImageGrid";
import { Message } from "./ChatBoot";
import DataGridTable from "./DataGridTable";

interface Props {
  message: Message;
}

export default function MessageItem({ message }: Props) {
  const hasImages = message.images && message.images.length > 0;

  return (
    <div style={{ marginBottom: 16 }}>
      {hasImages && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 40px" }}>
          <ImageGrid images={message.images || []} />
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({  ...props }) => (
            <DataGridTable {...props}>{props.children}</DataGridTable>
          ),
          th: ({  ...props }) => (
            <th
              style={{
                border: "1px solid #ccc",
                padding: "8px",
                background: "#f3f3f3",
                fontWeight: "bold",
              }}
              {...props}
            >
              {props.children}
            </th>
          ),
          td: ({  ...props }) => (
            <td
              style={{ border: "1px solid #ccc", padding: "8px", color: "#111" }}
              {...props}
            >
              {props.children}
            </td>
          ),
          p: ({  ...props }) => (
            <p style={{ color: "--white" }} {...props}>
              {props.children}
            </p>
          ),
        }}
      >
        {message.text}
      </ReactMarkdown>
    </div>
  );
}
