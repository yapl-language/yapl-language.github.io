import React, { useEffect, useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import { YAPL } from "../yapl/packages/yapl/src/index.ts";

const INITIAL_FILES = {
  "/prompts/base/system.md.yapl": `# System
{% block persona %}
	You are a helpful AI.
{% endblock %}

{% block output_format %}
	Respond in markdown.
{% endblock %}

{% block guidance %}
	Be concise and accurate.
{% endblock %}
`,
  "/prompts/mixins/tone_friendly.md.yapl": `{% block persona %}
	{{ super() }}
	Adopt a friendly, upbeat tone.
{% endblock %}
`,
  "/prompts/examples/conditional-agent.md.yapl": `{% extends "../base/system.md.yapl" %}
{% mixin "../mixins/tone_friendly.md.yapl" %}

{% block persona %}
{{ super() }}
{% if user_type == "expert" %}
You are an advanced AI assistant with deep technical knowledge.
{% else %}
You are a beginner-friendly AI assistant that explains things simply.
{% endif %}

{% if domain is defined %}
You specialize in {{ domain }}.
{% endif %}
{% endblock %}

{% block guidance %}
{{ super() }}
{% if user_type == "expert" %}
Provide detailed technical explanations with code examples when relevant.
{% else %}
Use simple language and avoid jargon. Provide step-by-step explanations.
{% endif %}

{% if include_examples is defined and include_examples %}
Always include practical examples in your responses.
{% endif %}
{% endblock %}

{% block capabilities %}
{% if capability_1 is defined %}
## Your Capabilities
- {{ capability_1 }}
{% if capability_2 is defined %}
- {{ capability_2 }}
{% endif %}
{% if capability_3 is defined %}
- {{ capability_3 }}
{% endif %}
{% endif %}
{% endblock %}
`,
};

export default function YaplPlayground() {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [varsText, setVarsText] = useState(
    JSON.stringify(
      {
        user_type: "expert",
        domain: "TypeScript",
        include_examples: true,
        capability_1: "Explain complex topics clearly",
        capability_2: "Provide code samples",
      },
      null,
      2
    )
  );

  const files = useMemo(() => {
    const f = {};
    Object.entries(INITIAL_FILES).forEach(([k, v]) => {
      f[k] = { code: v };
    });
    return f;
  }, []);

  // Initialize virtual FS from initial files on mount
  useEffect(() => {
    const vfs = new Map();
    Object.entries(INITIAL_FILES).forEach(([k, v]) => {
      vfs.set("/vfs" + k, v);
    });
    window.__YAPL_VFS = vfs;
  }, []);

  const renderNow = async () => {
    // Ensure VFS is initialized and contains all initial files
    let vfs = window.__YAPL_VFS;
    if (!(vfs instanceof Map)) vfs = new Map();
    Object.entries(INITIAL_FILES).forEach(([k, v]) => {
      const key = "/vfs" + k;
      if (!vfs.has(key)) vfs.set(key, v);
    });
    window.__YAPL_VFS = vfs;

    let vars = {};
    try {
      vars = JSON.parse(varsText || "{}");
    } catch (e) {
      setStatus("Invalid JSON in variables");
      return;
    }
    setStatus("Rendering...");
    const t0 = performance.now();
    try {
      const engine = new YAPL({ baseDir: "/vfs" });
      const { content } = await engine.render(
        "prompts/examples/conditional-agent.md.yapl",
        vars
      );
      setOutput(content);
      const t1 = performance.now();
      setStatus(`Rendered in ${Math.round(t1 - t0)}ms`);
    } catch (err) {
      setStatus(String(err));
      setOutput("");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">YAPL Playground</h3>
      </div>
      <SandpackProvider
        template="vanilla"
        files={files}
        options={{
          visibleFiles: Object.keys(INITIAL_FILES),
          activeFile: "/prompts/examples/conditional-agent.md.yapl",
        }}
      >
        <SandpackLayout>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: 380, borderRadius: 12 }}
              onCodeUpdate={(code, path) => {
                // update VFS on every keystroke for this file
                let current = window.__YAPL_VFS;
                if (!(current instanceof Map)) {
                  current = new Map();
                  // seed all initial files so nothing is missing
                  Object.entries(INITIAL_FILES).forEach(([k, v]) => {
                    current.set("/vfs" + k, v);
                  });
                }
                if (path.endsWith(".yapl")) {
                  current.set("/vfs" + path, code);
                  window.__YAPL_VFS = current;
                }
              }}
            />
          </div>
          <div style={{ width: 360 }} className="p-2 flex flex-col gap-2">
            <label className="text-sm font-medium">Variables (JSON)</label>
            <textarea
              value={varsText}
              onChange={(e) => setVarsText(e.target.value)}
              rows={10}
              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent p-2 text-sm font-mono"
            />
            <button
              className="btn border border-gray-300 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-600"
              onClick={async () => {
                await renderNow();
              }}
            >
              Render
            </button>
            <div className="text-xs text-gray-500">{status}</div>
          </div>
        </SandpackLayout>
      </SandpackProvider>
      <div className="mt-4">
        <label className="text-sm font-medium">Output</label>
        <pre
          className="mt-1 p-3 rounded border border-gray-200 dark:border-gray-800 text-xs overflow-auto"
          id="output"
        >
          {output}
        </pre>
      </div>
    </div>
  );
}
