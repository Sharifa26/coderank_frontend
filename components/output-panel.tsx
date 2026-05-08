"use client";

import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { ExecutionStatus, IRunCodeResponse } from "@/types";
import { FormEvent, useEffect, useRef, useState } from "react";

interface OutputPanelProps {
  output: IRunCodeResponse["data"] | null;
  isRunning: boolean;
  executionStatus: ExecutionStatus;
  terminalOutput: string;
  onSendInput: (value: string) => void;
  onClear: () => void;
}

const OutputPanel = ({
  output,
  isRunning,
  executionStatus,
  terminalOutput,
  onSendInput,
  onClear,
}: OutputPanelProps) => {
  const [liveInput, setLiveInput] = useState("");
  const liveInputRef = useRef<HTMLInputElement>(null);
  const isSuccess =
    isRunning || (output?.status !== "error" && output?.status !== "timeout");
  const canSendInput =
    executionStatus === "running" || executionStatus === "waiting_for_input";

  const statusLabel = isRunning
    ? executionStatus
        .split("_")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join(" ")
    : isSuccess
      ? "Success"
      : "Error";

  const displayOutput = terminalOutput || output?.error || output?.output || "";

  useEffect(() => {
    if (canSendInput) {
      liveInputRef.current?.focus();
    }
  }, [canSendInput, displayOutput]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!liveInput.trim() || !canSendInput) {
      return;
    }

    onSendInput(`${liveInput}\n`);
    setLiveInput("");
  };

  const terminalInput = canSendInput ? (
    <form
      onSubmit={handleSubmit}
      className="inline-flex min-w-[12ch] align-baseline"
    >
      <input
        ref={liveInputRef}
        value={liveInput}
        onChange={(event) => setLiveInput(event.target.value)}
        aria-label="Live program input"
        className="min-w-[12ch] flex-1 bg-transparent font-mono text-sm text-white caret-[#00f060] outline-none"
        autoComplete="off"
        spellCheck={false}
      />
    </form>
  ) : null;

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-lg border border-[#1f3045] bg-[#030b15]/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex h-12 items-center border-b border-[#1b2a3c] px-4 sm:px-5">
        <h3 className="text-lg font-semibold text-white">Output</h3>
      </div>

      {(output || isRunning || terminalOutput) && (
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-[#1b2a3c] px-4 py-2 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span
              className={`rounded-md px-2.5 py-1 text-sm ${
                isSuccess
                  ? "bg-emerald-500/14 text-[#00f060]"
                  : "bg-red-500/14 text-red-300"
              }`}
            >
              {statusLabel}
            </span>

            <span className="truncate text-sm text-[#909ab1]">
              {output?.executionTime || "Running"}
            </span>
          </div>

          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#1d3045] bg-[#07111e]/60 px-3 text-sm text-white hover:bg-[#0a1727]"
            onClick={onClear}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      )}

      <div
        className="flex-grow overflow-auto px-4 py-4 font-mono text-sm leading-6 text-white sm:px-5 sm:py-5"
        onClick={() => liveInputRef.current?.focus()}
      >
        {(displayOutput || terminalInput) && (
          <div
            className={`whitespace-pre-wrap ${
              output?.error && !terminalOutput ? "text-red-300" : "text-white"
            }`}
          >
            {displayOutput}
            {terminalInput}
          </div>
        )}

        {!displayOutput && isRunning && !terminalInput && (
          <p className="text-[#94a0b8]">Starting execution...</p>
        )}

        {!displayOutput && !isRunning && (
          <p className="text-[#647089]">Run your code to see output.</p>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
