import Image from "next/image";
import { Code, Zap, Sparkles, Share2 } from "lucide-react";

const features = [
  { icon: Code, title: "Write Code", description: "Powerful code editor" },
  { icon: Zap, title: "Run Instantly", description: "Compile & run fast" },
  { icon: Sparkles, title: "AI Optimize", description: "Improve with AI" },
  { icon: Share2, title: "Share Easily", description: "Share your code" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_34%),linear-gradient(135deg,#030712_0%,#050b16_48%,#0b1020_100%)] p-3 text-foreground md:p-4">
      <div className="mx-auto grid h-full w-full max-w-[82rem] grid-cols-1 overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/75 shadow-2xl shadow-black/50 md:grid-cols-[0.74fr_1.26fr]">
        <div className="flex min-h-0 items-center justify-center px-7 py-5 md:px-9 lg:px-10">
          {children}
        </div>

        <section className="relative hidden min-h-0 overflow-hidden border-l border-slate-700/70 bg-[radial-gradient(circle_at_64%_18%,rgba(148,163,184,0.5),transparent_28%),linear-gradient(145deg,rgba(30,41,59,0.95),rgba(8,13,28,0.98)_62%)] px-8 py-6 md:flex md:flex-col">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(124,58,237,0.12),transparent_45%),radial-gradient(circle_at_bottom,rgba(79,70,229,0.16),transparent_38%)]" />

          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-[20rem] w-full max-w-[34rem] lg:h-[23rem] lg:max-w-[40rem]">
              <Image
                src="/illustration.png"
                alt="Code editor illustration"
                fill
                priority
                sizes="50vw"
                className="scale-110 object-contain drop-shadow-[0_28px_70px_rgba(79,70,229,0.32)]"
              />
            </div>
          </div>

          <div className="relative grid grid-cols-4 gap-4 pb-3 text-center">
            {features.map((feature) => (
              <div key={feature.title} className="min-w-0">
                <feature.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <h3 className="mb-1 text-sm font-semibold text-white lg:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs leading-5 text-slate-300 lg:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
