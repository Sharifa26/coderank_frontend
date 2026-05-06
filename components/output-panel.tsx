import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Trash2 } from "lucide-react";
import { IRunCodeResponse } from "@/types";

interface OutputPanelProps {
  output: IRunCodeResponse["data"] | null;
  stdin: string;
  isRunning: boolean;
  onStdinChange: (value: string) => void;
  onClear: () => void;
}

const OutputPanel = ({
  output,
  stdin,
  isRunning,
  onStdinChange,
  onClear,
}: OutputPanelProps) => {
  const isSuccess =
    isRunning || (output?.status !== "error" && output?.status !== "timeout");

  const statusLabel = isRunning ? "Running" : isSuccess ? "Success" : "Error";

  const displayOutput = output?.error || output?.output || "";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#1f3045] bg-[#030b15]/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex h-12 items-center border-b border-[#1b2a3c] px-5">
        <h3 className="text-lg font-semibold text-white">Output</h3>
      </div>

      {(output || isRunning) && (
        <div className="flex h-14 items-center justify-between border-b border-[#1b2a3c] px-5">
          <div className="flex items-center gap-4">
            <span
              className={`rounded-md px-2.5 py-1 text-sm ${
                isSuccess
                  ? "bg-emerald-500/14 text-[#00f060]"
                  : "bg-red-500/14 text-red-300"
              }`}
            >
              {statusLabel}
            </span>

            <span className="text-sm text-[#909ab1]">
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

      <div className="flex-grow overflow-y-auto px-5 py-5 font-mono text-sm leading-6 text-white">
        {output && (
          <pre
            className={`whitespace-pre-wrap ${
              output.error ? "text-red-300" : "text-white"
            }`}
          >
            {displayOutput}
          </pre>
        )}

        {!output && isRunning && (
          <p className="text-[#94a0b8]">Running code...</p>
        )}

        {!output && !isRunning && (
          <p className="text-[#647089]">Run your code to see output.</p>
        )}

      </div>

      <div className="border-t border-[#1b2a3c] px-5 py-4">
        <label
          htmlFor="program-stdin"
          className="mb-2 block text-sm font-medium text-[#a9afc2]"
        >
          Input
        </label>
        <Textarea
          id="program-stdin"
          value={stdin}
          onChange={(event) => onStdinChange(event.target.value)}
          placeholder="Enter program input here"
          disabled={isRunning}
          className="min-h-24 resize-none border-[#1d3045] bg-[#07111e]/60 font-mono text-sm text-white placeholder:text-[#647089]"
        />
      </div>
    </div>
  );
};

export default OutputPanel;
