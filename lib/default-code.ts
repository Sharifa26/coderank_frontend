export type SupportedLanguage =
  | "python"
  | "javascript"
  | "java"
  | "c"
  | "cpp"
  | "go"
  | "rust";

export const languageDetails: Record<
  SupportedLanguage,
  {
    label: string;
    fileName: string;
    badge: string;
    badgeClassName: string;
    iconUrl: string;
    defaultCode: string;
  }
> = {
  python: {
    label: "Python 3.11",
    fileName: "main.py",
    badge: "Py",
    badgeClassName: "bg-[#ffd43b] text-[#2851a3]",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    defaultCode: `# Welcome to CodeNova Compiler
# Write, Run and Optimize your code

print("Hello, CodeNova!")
`,
  },
  javascript: {
    label: "JavaScript",
    fileName: "main.js",
    badge: "js",
    badgeClassName: "bg-[#f7df1e] text-[#111827]",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    defaultCode: `// Welcome to CodeNova Compiler
// Write, Run and Optimize your code

console.log("Hello, CodeNova!");`,
  },
  java: {
    label: "Java",
    fileName: "Main.java",
    badge: "Ja",
    badgeClassName: "bg-[#f89820] text-[#10233f]",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg",
    defaultCode: `// Welcome to CodeNova Compiler
// Write, Run and Optimize your code

class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeNova!");
    }
}`,
  },
  c: {
    label: "C",
    fileName: "main.c",
    badge: "C",
    badgeClassName: "bg-[#659ad2] text-white",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
    defaultCode: `// Welcome to CodeNova Compiler
// Write, Run and Optimize your code

#include <stdio.h>

int main(void) {
    printf("Hello, CodeNova!\\n");
    return 0;
}`,
  },
  cpp: {
    label: "C++",
    fileName: "main.cpp",
    badge: "C++",
    badgeClassName: "bg-[#00599c] text-white",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
    defaultCode: `// Welcome to CodeNova Compiler
// Write, Run and Optimize your code

#include <iostream>

int main() {
    std::cout << "Hello, CodeNova!" << std::endl;
    return 0;
}`,
  },
  go: {
    label: "Go",
    fileName: "main.go",
    badge: "Go",
    badgeClassName: "bg-[#00add8] text-[#06101c]",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original-wordmark.svg",
    defaultCode: `// Welcome to CodeNova Compiler
// Write, Run and Optimize your code

package main

import "fmt"

func main() {
    fmt.Println("Hello, CodeNova!")
}`,
  },
  rust: {
    label: "Rust",
    fileName: "main.rs",
    badge: "Rs",
    badgeClassName: "bg-[#dea584] text-[#21130b]",
    iconUrl:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    defaultCode: `// Welcome to CodeNova Compiler
// Write, Run and Optimize your code

fn main() {
    println!("Hello, CodeNova!");
}`,
  },
};

export const languages = Object.entries(languageDetails).map(
  ([value, details]) => ({
    value: value as SupportedLanguage,
    label: details.label,
  }),
);
