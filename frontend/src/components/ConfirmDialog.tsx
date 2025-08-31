import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
`;
const Box = styled.div`
  background: var(--card);
  color: var(--text);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  width: min(420px, 92vw);
`;
const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;
const Btn = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #444;
  background: #111827;
  color: var(--text);
`;
const Danger = styled(Btn)`
  border-color: #ef4444;
  color: #ef4444;
`;

export default function ConfirmDialog({
  text,
  onOk,
  onCancel,
}: {
  text: string;
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <Overlay>
      <Box>
        <div>{text}</div>
        <Row>
          <Btn onClick={onCancel}>Cancel</Btn>
          <Danger onClick={onOk}>OK</Danger>
        </Row>
      </Box>
    </Overlay>
  );
}
