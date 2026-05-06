"use client";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

const CodeEditor = ({ language, value, onChange }: CodeEditorProps) => {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 16,
        lineHeight: 26,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 18, bottom: 18 },
        lineNumbersMinChars: 3,
        glyphMargin: false,
        folding: false,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        renderLineHighlight: "none",
        guides: { indentation: true },
        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
          handleMouseWheel: true,
        },
      }}
    />
  );
};

export default CodeEditor;
