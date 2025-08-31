import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --bg: #0f172a;
  --card: #0b1220;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --accent: #60a5fa;
}
* { box-sizing:border-box; }
html,body,#root { height:100%; }
body {
  margin:0;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  background: linear-gradient(180deg, #071021 0%, #0b1220 100%);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
}
a { color:inherit; text-decoration:none; }
input { background:#071427; color:var(--text); border:1px solid #1f2937; padding:.5rem; border-radius:8px; width:100%; }
button { cursor:pointer; }
`;
