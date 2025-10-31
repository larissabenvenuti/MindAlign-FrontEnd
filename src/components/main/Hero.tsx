import { Button } from "../ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => (
  <section className="relative min-h-screen flex items-center py-0 justify-center overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(270_50%_99%),hsl(270_60%_96%))]" />
    <div className="absolute top-[18%] left-1/6 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
    <div
      className="absolute bottom-[12%] right-1/6 w-60 h-60 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none"
      style={{ animationDelay: "1s" }}
    />

    <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col w-full">
      <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
        <div className="space-y-7 pr-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm md:text-base shadow">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-primary">
              Sua rotina, simplificada
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight md:leading-snug">
            Organize sua vida <br />
            com{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MindAlign
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl">
            Seu painel visual para foco total: monte cronogramas, acompanhe
            tarefas, hábitos e anotações, sem esforço.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              Começar agora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <div className="relative flex flex-col items-center">
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl px-7 py-8 min-h-[320px] shadow transition-shadow">
            <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col items-center gap-4 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center mb-2 shadow">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center mb-1">
                Tudo sob controle
              </h3>
              <p className="text-muted-foreground text-center mx-auto max-w-[360px]">
                Visualize compromissos, tarefas e hábitos numa interface limpa e
                prática.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
