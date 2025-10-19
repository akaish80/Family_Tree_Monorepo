import { useNode } from "@craftjs/core";

interface TextComponentProps {
  text: string;
}

const TextComponent = ({ text }: TextComponentProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }}>
      <h2>{text}</h2>
    </div>
  );
};

export default TextComponent;