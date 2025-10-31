import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  BookOpen,
  Target,
  CheckCircle2,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeSidebarSelector from "../components/context/ThemeSidebarSelector";
import ActivitySection from "../components/dashboard/ActivitySection";

interface ActivityItem {
  id: string;
  type: "event" | "note" | "habit" | "task";
  content: string;
  date: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/activity", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setRecentActivity)
      .catch(() => setRecentActivity([]))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (type: string) => {
    const iconClasses = "w-5 h-5 text-foreground";
    switch (type) {
      case "event":
        return <Calendar className={iconClasses} />;
      case "note":
        return <BookOpen className={iconClasses} />;
      case "habit":
        return <Target className={iconClasses} />;
      case "task":
        return <CheckCircle2 className={iconClasses} />;
      default:
        return <Activity className={iconClasses} />;
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 sm:top-24 sm:right-24 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-muted rounded-full blur-3xl animate-float opacity-70" />
        <div
          className="absolute bottom-20 left-10 sm:bottom-24 sm:left-24 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-secondary rounded-full blur-3xl animate-float opacity-70"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="h-20 sm:h-24" />

      <div className="relative flex min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)]">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className={`
            fixed top-24 left-3 z-40
            lg:absolute lg:top-6 lg:left-6
            bg-card border border-border rounded-full 
            w-10 h-10 sm:w-12 sm:h-12
            flex items-center justify-center 
            shadow-lg hover:shadow-xl
            transition-all duration-200 hover:scale-110
            ${sidebarOpen ? "lg:left-[280px]" : ""}
          `}
          aria-label={
            sidebarOpen ? "Fechar seleção de tema" : "Abrir seleção de tema"
          }
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          )}
        </button>

        <aside
          className={`
            fixed top-20 sm:top-24 left-0 bottom-0 z-30
            lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]
            transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"
            }
          `}
        >
          {sidebarOpen && <ThemeSidebarSelector />}
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            <header className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Olá, {user?.name || "Usuário"} 👋
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                Que bom ter você no MindAlign. Utilize os atalhos abaixo para
                acessar rapidamente seus módulos favoritos.
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              <Link to="/calendar" className="group">
                <article className="bg-card hover:bg-secondary/60 transition-all duration-200 border border-border rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl h-full flex flex-col items-start">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                    Calendário
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Gerencie seus eventos, compromissos e datas importantes.
                  </p>
                </article>
              </Link>

              <Link to="/notes" className="group">
                <article className="bg-card hover:bg-secondary/60 transition-all duration-200 border border-border rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl h-full flex flex-col items-start">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-200">
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                    Anotações
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Suas notas rápidas e registros do dia a dia.
                  </p>
                </article>
              </Link>

              <Link to="/habits" className="group">
                <article className="bg-card hover:bg-secondary/60 transition-all duration-200 border border-border rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl h-full flex flex-col items-start">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-200">
                    <Target className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                    Hábitos
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Crie, monitore e mantenha seus hábitos positivos.
                  </p>
                </article>
              </Link>

              <Link to="/tasks" className="group">
                <article className="bg-card hover:bg-secondary/60 transition-all duration-200 border border-border rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl h-full flex flex-col items-start">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-200">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                    Tarefas
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Organize sua lista de afazeres e mantenha o foco.
                  </p>
                </article>
              </Link>
            </div>
            <ActivitySection />
          </div>
        </main>
      </div>
    </section>
  );
}
