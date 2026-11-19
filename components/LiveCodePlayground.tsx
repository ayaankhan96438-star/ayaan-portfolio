"use client";

import { useMemo, useState } from "react";
import { Code2, Eye, RotateCcw, Sparkles } from "lucide-react";

type CodeTab = "html" | "css" | "js";

const starterHtml = `<article class="demo-card">
  <span class="demo-kicker">A SMALL EXPERIMENT / 001</span>
  <h1>Make it<br /><em>matter.</em></h1>
  <p>Good ideas become good interfaces when you keep shaping them.</p>
  <button class="demo-button" data-count>
    Try the interaction <span>↗</span>
  </button>
</article>`;

const starterCss = `* { box-sizing: border-box; }
body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  padding: 28px;
  color: #eff2e8;
  font-family: Inter, Arial, sans-serif;
  background:
    radial-gradient(circle at 80% 15%, #3b5632 0, transparent 38%),
    #121914;
}
.demo-card {
  width: min(100%, 430px);
  padding: clamp(28px, 7vw, 48px);
  border: 1px solid #52634b;
  border-radius: 18px;
  background: linear-gradient(145deg, #202d23, #151d18);
  box-shadow: 0 28px 80px #0008;
}
.demo-kicker {
  color: #b9da7a;
  font-size: 10px;
  letter-spacing: .16em;
}
h1 {
  margin: 34px 0 18px;
  font-size: clamp(52px, 10vw, 82px);
  line-height: .88;
  letter-spacing: -.08em;
}
h1 em { color: #b9da7a; font-style: normal; }
p { color: #a6b1a4; line-height: 1.7; font-size: 14px; }
.demo-button {
  margin-top: 22px;
  padding: 14px 17px;
  border: 1px solid #b9da7a;
  border-radius: 7px;
  color: #11180f;
  background: #b9da7a;
  font: 700 12px Inter, Arial, sans-serif;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease;
}
.demo-button:hover { transform: translateY(-3px); background: #d3efa0; }
.demo-button span { margin-left: 18px; }`;

const starterJs = `const button = document.querySelector("[data-count]");
let clicks = 0;

button?.addEventListener("click", () => {
  clicks += 1;
  button.innerHTML = "Nice. You clicked " + clicks + " time(s) <span>↗</span>";
});`;

const tabLabels: Record<CodeTab, { label: string; filename: string }> = {
  html: { label: "HTML", filename: "index.html" },
  css: { label: "CSS", filename: "styles.css" },
  js: { label: "JS", filename: "script.js" },
};

export function LiveCodePlayground() {
  const [activeTab, setActiveTab] = useState<CodeTab>("html");
  const [html, setHtml] = useState(starterHtml);
  const [css, setCss] = useState(starterCss);
  const [js, setJs] = useState(starterJs);
  const [runCount, setRunCount] = useState(1);

  const currentCode = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const setCurrentCode = activeTab === "html" ? setHtml : activeTab === "css" ? setCss : setJs;
  const previewDocument = useMemo(
    () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>${css}</style>
</head>
<body>
${html}
<script>
${js}
<\/script>
</body>
</html>`,
    [html, css, js],
  );

  const resetCode = () => {
    setHtml(starterHtml);
    setCss(starterCss);
    setJs(starterJs);
    setActiveTab("html");
    setRunCount((count) => count + 1);
  };

  return (
    <section className="code-lab-section" aria-labelledby="code-lab-title">
      <div className="code-lab-heading" data-cinematic-reveal>
        <div>
          <span className="code-lab-kicker"><Code2 size={14} /> THE LIVE PLAYGROUND</span>
          <h2 id="code-lab-title">Change the code.<br /><span>Watch it happen.</span></h2>
        </div>
        <p>Edit the HTML, CSS or JavaScript on the left. Your result runs in its own sandbox on the right — experiment freely, then reset whenever you like.</p>
      </div>

      <div className="code-lab-workspace" data-cinematic-reveal>
        <div className="code-lab-editor-panel">
          <div className="code-lab-panel-bar">
            <span className="code-lab-window-dots"><i /><i /><i /></span>
            <span>EDITOR / 001</span>
            <span className="code-lab-live-indicator"><i /> READY</span>
          </div>

          <div className="code-lab-tabs" role="tablist" aria-label="Code language">
            {(["html", "css", "js"] as CodeTab[]).map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? "code-lab-tab is-active" : "code-lab-tab"}
                key={tab}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab].label}
              </button>
            ))}
            <span className="code-lab-filename">{tabLabels[activeTab].filename}</span>
          </div>

          <div className="code-lab-textarea-wrap">
            <span className="code-lab-line-count" aria-hidden="true">
              {currentCode.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}
            </span>
            <textarea
              aria-label={`Edit ${tabLabels[activeTab].filename}`}
              className="code-lab-textarea"
              value={currentCode}
              onChange={(event) => setCurrentCode(event.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
            />
          </div>

          <div className="code-lab-editor-footer">
            <span><Sparkles size={13} /> YOUR SPACE TO EXPERIMENT</span>
            <button type="button" onClick={resetCode}><RotateCcw size={13} /> Reset code</button>
          </div>
        </div>

        <div className="code-lab-preview-panel">
          <div className="code-lab-panel-bar">
            <span className="code-lab-window-dots"><i /><i /><i /></span>
            <span>LIVE RESULT</span>
            <span className="code-lab-preview-status"><Eye size={13} /> PREVIEW</span>
          </div>
          <div className="code-lab-browser-bar">
            <span>◉</span><span>your-experiment.local</span><span>↗</span>
          </div>
          <iframe
            key={runCount}
            title="Live code result preview"
            className="code-lab-iframe"
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            srcDoc={previewDocument}
          />
          <div className="code-lab-preview-footer">SANDBOXED PREVIEW <span>·</span> CHANGES APPEAR LIVE</div>
        </div>
      </div>
      <p className="code-lab-footnote">A small playground, not a production editor. The preview is isolated from the portfolio page.</p>
    </section>
  );
}
