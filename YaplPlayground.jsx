import React, { useEffect, useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { yaplExtension } from "./yapl-codemirror";
import { YAPL } from "@yapl-language/yapl.ts";

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

function PlaygroundContent({
  output,
  setOutput,
  status,
  setStatus,
  varsText,
  setVarsText,
  renderNow,
}) {
  const { sandpack } = useSandpack();

  // Listen for file changes and update VFS
  useEffect(() => {
    const updateVFS = () => {
      let current = window.__YAPL_VFS;
      if (!(current instanceof Map)) {
        current = new Map();
        // seed all initial files so nothing is missing
        Object.entries(INITIAL_FILES).forEach(([k, v]) => {
          current.set("/vfs" + k, v);
        });
      }

      // Update VFS with current file contents
      Object.entries(sandpack.files).forEach(([path, file]) => {
        if (path.endsWith(".yapl")) {
          current.set("/vfs" + path, file.code);
        }
      });

      window.__YAPL_VFS = current;
    };

    updateVFS();
  }, [sandpack.files]);

  return (
    <SandpackLayout>
      <div style={{ flex: 1, minWidth: 0 }} className="p-2 pt-4">
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors
          wrapContent
          extensions={[yaplExtension()]}
          style={{ height: 380, borderRadius: 12 }}
        />
      </div>
      <div style={{ width: 360, minHeight: 380 }} className="p-2 pt-4 flex flex-col gap-2">
        <label className="text-sm font-medium h-9 flex items-center">Variables (JSON)</label>
        <textarea style={{ flex: 1, minHeight: 0 }}
          value={varsText}
          onChange={(e) => setVarsText(e.target.value)}
          rows={10}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 p-2 text-sm font-mono"
        />
        <button
          className="btn mt-auto bg-gradient-to-r from-brand-500 to-rose-500 text-white shadow-glow hover:opacity-95 border border-transparent"
          onClick={async () => {
            await renderNow();
          }}
        >
          Render
        </button>
        <div className="text-xs text-gray-500">{status}</div>
      </div>
    </SandpackLayout>
  );
}

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

  // Keep Sandpack theme in sync with the site theme (html.dark)
  const [themeMode, setThemeMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setThemeMode(el.classList.contains("dark") ? "dark" : "light");
    });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setThemeMode(document.documentElement.classList.contains("dark") ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => {
      obs.disconnect();
      mql.removeEventListener("change", onChange);
    };
  }, []);

  const lightTheme = {
    colors: {
      surface1: "#f8fafc",
      surface2: "#f1f5f9",
      surface3: "#e2e8f0",
      base: "#111827",
      clickable: "#374151",
      disabled: "#9ca3af",
      accent: "#f472b6",
      error: "#ef4444",
      errorSurface: "#fee2e2",
      warning: "#f59e0b",
      warningSurface: "#fef3c7",
      success: "#10b981",
      successSurface: "#d1fae5",
    },
    syntax: {
      plain: "#111827",
      comment: "#64748b",
      punctuation: "#334155",
      keyword: "#db2777",
      tag: "#db2777",
      string: "#16a34a",
      number: "#b45309",
      operator: "#0ea5e9",
      function: "#7c3aed",
      variable: "#ea580c",
      definition: "#2563eb",
      property: "#0284c7",
    },
    typography: {
      fontSize: "12.5px",
      fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
    },
  };

  const darkTheme = {
    colors: {
      surface1: "#0f172a",
      surface2: "#111827",
      surface3: "#1f2937",
      base: "#e5e7eb",
      clickable: "#d1d5db",
      disabled: "#6b7280",
      accent: "#f472b6",
      error: "#f87171",
      errorSurface: "#451a1a",
      warning: "#f59e0b",
      warningSurface: "#451a03",
      success: "#34d399",
      successSurface: "#052e1b",
    },
    syntax: {
      plain: "#e5e7eb",
      comment: "#9ca3af",
      punctuation: "#94a3b8",
      keyword: "#fb7185",
      tag: "#fb7185",
      string: "#4ade80",
      number: "#fbbf24",
      operator: "#7dd3fc",
      function: "#c084fc",
      variable: "#fdba74",
      definition: "#93c5fd",
      property: "#7dd3fc",
    },
    typography: {
      fontSize: "12.5px",
      fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
    },
  };

  const currentTheme = themeMode === "dark" ? darkTheme : lightTheme;

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
      // Create YAPL instance with browser-compatible options
      const engine = new YAPL({
        baseDir: "/vfs",
        // Provide custom file loading function for browser
        loadFile: async (absolutePath) => {
          const content = vfs.get(absolutePath);
          if (content === undefined) {
            throw new Error(
              `File not found: ${absolutePath}. Available files: ${Array.from(
                vfs.keys()
              ).join(", ")}`
            );
          }
          return content;
        },
        // Provide custom path resolution for browser
        resolvePath: (templateRef, fromDir, ensureExt) => {
          let resolved;
          if (templateRef.startsWith("/")) {
            // Absolute path
            resolved = templateRef;
          } else {
            // Relative path - resolve relative to fromDir
            // Combine fromDir and templateRef
            if (fromDir.endsWith("/")) {
              resolved = fromDir + templateRef;
            } else {
              resolved = fromDir + "/" + templateRef;
            }
          }

          // Normalize the path (handle .. and .)
          const parts = resolved.split("/").filter((p) => p);
          const normalizedParts = [];

          for (const part of parts) {
            if (part === "..") {
              normalizedParts.pop();
            } else if (part !== ".") {
              normalizedParts.push(part);
            }
          }

          const normalizedPath = "/" + normalizedParts.join("/");
          return ensureExt(normalizedPath);
        },
        ensureExtension: (p) => {
          return p.endsWith(".yapl") ? p : p + ".yapl";
        },
      });

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
      console.error("YAPL render error:", err);
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
        theme={currentTheme}
        options={{
          visibleFiles: Object.keys(INITIAL_FILES),
          activeFile: "/prompts/examples/conditional-agent.md.yapl",
        }}
      >
        <PlaygroundContent
          output={output}
          setOutput={setOutput}
          status={status}
          setStatus={setStatus}
          varsText={varsText}
          setVarsText={setVarsText}
          renderNow={renderNow}
        />
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
