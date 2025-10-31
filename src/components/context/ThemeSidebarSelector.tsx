import { useState, useEffect } from "react";
import { Palette, Sun, Moon, Check } from "lucide-react";

const THEMES = [
  {
    id: "default",
    label: "Azul",
    color: "bg-[#2563eb]",
    icon: <Check className="w-5 h-5" />,
  },
  {
    id: "theme-rosa",
    label: "Rosa",
    color: "bg-pink-400",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: "theme-verde",
    label: "Verde",
    color: "bg-green-400",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: "theme-sol",
    label: "Modo Sol",
    color: "bg-yellow-400",
    icon: <Sun className="w-5 h-5" />,
  },
  {
    id: "theme-dark",
    label: "Modo Escuro",
    color: "bg-black",
    icon: <Moon className="w-5 h-5" />,
  },
];

export default function ThemeSidebarSelector() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("user-theme") || "default"
  );

  useEffect(() => {
    document.documentElement.classList.remove(
      "theme-rosa",
      "theme-verde",
      "theme-sol",
      "theme-dark"
    );
    if (theme && theme !== "default") {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem("user-theme", theme);
  }, [theme]);

  return (
    <aside className="flex flex-col gap-6 p-6 min-w-[220px]">
      <h2
        className={`text-xl font-bold mb-2 ${
          theme === "theme-dark" ? "text-white" : ""
        }`}
      >
        Selecione o Tema
      </h2>
      <div className="flex flex-col gap-2">
        {THEMES.map(({ id, label, color, icon }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={`
              flex items-center justify-between gap-3 rounded-full transition-all px-4 py-3 font-semibold
              ${
                theme === id
                  ? id === "theme-dark"
                    ? "bg-black text-white ring-2 ring-zinc-900 shadow-lg scale-[1.03]"
                    : `${color} text-white ring-2 ring-primary shadow-lg scale-[1.03]`
                  : "bg-white text-foreground border border-border"
              }
              ${theme === id ? "" : "hover:bg-muted/50"}
            `}
          >
            <div className="flex items-center gap-3">
              <span
                className={`
                  inline-flex items-center justify-center w-6 h-6 rounded-full
                  ${
                    theme === id
                      ? "bg-white/20 border-2 border-white"
                      : "bg-muted border border-muted-foreground/20"
                  }
                `}
              >
                {theme === id ? <Check className="w-4 h-4" /> : icon}
              </span>
              <span className="text-base font-semibold">{label}</span>
            </div>
            {theme === id && (
              <span className="ml-auto text-sm font-bold">Ativo</span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
