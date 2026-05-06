import { Button } from "./ui/button";
import { X, CheckCircle, Code } from "lucide-react";
import { IOptimizeResponse } from "@/types";

interface AiOptimizerPanelProps {
  result: IOptimizeResponse["data"] | null;
  onUseCode: (code: string) => void;
  onClose: () => void;
}

const AiOptimizerPanel = ({
  result,
  onUseCode,
  onClose,
}: AiOptimizerPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-primary">AI Optimizer</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      {!result ? (
        <div className="flex-grow flex items-center justify-center">
          Loading analysis...
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {result.suggestions[0] ||
                "Your code is functional and well-structured!"}
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Optimized Code</h4>
              <Button size="sm" onClick={() => onUseCode(result.optimizedCode)}>
                <Code className="h-4 w-4 mr-2" /> Use This Code
              </Button>
            </div>
            <pre className="bg-input p-3 rounded-md text-xs overflow-x-auto">
              <code>{result.optimizedCode}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Improvements</h4>
            <ul className="space-y-2 text-sm">
              {result.improvements.map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        AI suggestions are generated and may not always be 100% accurate. Please
        review before using.
      </p>
    </div>
  );
};

export default AiOptimizerPanel;
