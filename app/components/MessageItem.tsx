import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ImageCarousel from "./ImageCarousel";
import { Message } from "./ChatBoot";
import DataGridTable from "./DataGridTable";

interface Props {
  message: Message;
}

export default function MessageItem({ message }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      {message.images && message.images.length > 0 && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 40px" }}>
          <ImageCarousel images={message.images} />
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ ...props }) => (
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
          p: ({ node, ...props }) => (
            <p style={{ color: "#111" }} {...props}>
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
