// Minimal CodeMirror 6 extension to highlight YAPL-like templating blocks
// We reuse the Jinja2 legacy mode which matches Twig-like syntax:
//   {% ... %} blocks, {{ ... }} interpolations, {# ... #} comments
// This won't give full Markdown highlighting inside the file, but will
// properly color the templating constructs which greatly improves readability.

import { StreamLanguage } from "@codemirror/language";
import { Prec } from "@codemirror/state";


// Very small YAPL stream mode: highlight only inside delimiters
// - {{ ... }}: expressions/variables
// - {% ... %}: control blocks/keywords
// - {# ... #}: comments
// Outside delimiters is plain text, so words like "with" or "in" in prose
// are NOT highlighted.

const KEYWORDS = new Set([
  "if",
  "else",
  "endif",
  "elif",
  "for",
  "in",
  "with",
  "mixin",
  "block",
  "endblock",
  "extends",
  "include",
  "is",
  "defined",
  "not",
  "and",
  "or",
]);

function isWordChar(ch) {
  return /[\w_]/.test(ch);
}

function yaplStream() {
  return {
    startState() {
      return { ctx: "text" };
    },
    token(stream, state) {
      if (state.ctx === "text") {
        if (stream.match("{#")) {
          state.ctx = "comment";
          return "punctuation";
        }
        if (stream.match("{{")) {
          state.ctx = "expr";
          return "punctuation";
        }
        if (stream.match("{%")) {
          state.ctx = "block";
          return "punctuation";
        }
        // consume until next potential delimiter or EOL
        if (stream.skipTo("{")) {
          return null; // plain text
        }
        stream.skipToEnd();
        return null;
      }

      if (state.ctx === "comment") {
        if (stream.match("#}")) {
          state.ctx = "text";
          return "punctuation";
        }
        stream.skipTo("#}") || stream.skipToEnd();
        return "comment";
      }

      const close = state.ctx === "expr" ? "}}" : "%}";

      if (stream.match(close)) {
        state.ctx = "text";
        return "punctuation";
      }

      // Strings
      if (stream.peek() === '"' || stream.peek() === "'") {
        const quote = stream.next();
        let escaped = false, ch;
        while ((ch = stream.next()) != null) {
          if (ch === quote && !escaped) break;
          escaped = !escaped && ch === "\\";
        }
        return "string";
      }

      // Numbers
      if (/[0-9]/.test(stream.peek())) {
        stream.eatWhile(/[0-9_]/);
        // optional decimal
        if (stream.peek() === ".") {
          stream.next();
          stream.eatWhile(/[0-9_]/);
        }
        return "number";
      }

      // Operators / punctuation
      if (stream.match(/==|!=|>=|<=|=>|->|[+\-*/%=<>]/)) return "operator";
      if (stream.match(/[()\[\]{},.:]/)) return "punctuation";

      // Words (variables or keywords)
      if (isWordChar(stream.peek())) {
        let word = "";
        while (isWordChar(stream.peek())) word += stream.next();
        if (state.ctx === "block" && KEYWORDS.has(word)) return "keyword";
        return "variableName";
      }

      // Fallback consume one char
      stream.next();
      return null;
    },
  };
}

export function yaplExtension() {
  return StreamLanguage.define({
    token: yaplStream().token,
    startState: yaplStream().startState,
  });
}
