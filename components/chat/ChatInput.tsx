type Props = {
  onSend: (message: string) => void;
};

export function ChatInput({ onSend }: Props) {
  return (
    <button onClick={() => onSend("hello")}>
      Send
    </button>
  );
}
