import { useEffect, useState } from "react";
import {
  Activity,
  CheckSquare,
  StickyNote,
  CalendarDays,
  ListChecks,
} from "lucide-react";
import { api } from "../../lib/api";

interface ActivityItem {
  id: string;
  type: "event" | "note" | "habit" | "task";
  content: string;
  date: string;
}

function getIcon(type: string) {
  switch (type) {
    case "event":
      return <CalendarDays className="w-5 h-5 text-primary" />;
    case "note":
      return <StickyNote className="w-5 h-5 text-accent" />;
    case "habit":
      return <CheckSquare className="w-5 h-5 text-emerald-500" />;
    case "task":
      return <ListChecks className="w-5 h-5 text-blue-500" />;
    default:
      return <Activity className="w-5 h-5 text-muted-foreground" />;
  }
}

export default function RecentActivitySection() {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api
      .get<ActivityItem[]>("/api/activity")
      .then((data) => setRecentActivity(data))
      .catch((err) => setError("Erro ao buscar atividades"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-secondary/30 border border-border rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
        Atividade Recente
      </h2>

      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
          <p className="text-muted-foreground mt-3">Carregando...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-destructive text-base">
            {error}
          </p>
        </div>
      ) : recentActivity.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-muted-foreground text-sm sm:text-base">
            Nenhuma atividade recente encontrada.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 sm:space-y-4">
          {recentActivity.map((item) => (
            <li
              key={item.id + item.type}
              className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors duration-150"
            >
              <div className="flex-shrink-0 mt-1 sm:mt-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-sm sm:text-base text-foreground font-medium">
                  {item.type === "event" && (
                    <>Novo evento: <span className="font-semibold">{item.content}</span></>
                  )}
                  {item.type === "note" && (
                    <>Nova nota: <span className="font-semibold">{item.content}</span></>
                  )}
                  {item.type === "habit" && (
                    <>Novo hábito: <span className="font-semibold">{item.content}</span></>
                  )}
                  {item.type === "task" && (
                    <>Nova tarefa: <span className="font-semibold">{item.content}</span></>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {new Date(item.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
