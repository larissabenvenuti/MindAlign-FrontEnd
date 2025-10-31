import { useState, useEffect } from "react";
import { Trash2, Plus, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";

interface Habit {
  id: string;
  name: string;
  days: number[];
  completedDays: { [key: string]: boolean };
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      const data = await api.get<Habit[]>("/api/habits");
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar hábitos");
    } finally {
      setInitialLoading(false);
    }
  }

  async function handleAddHabit() {
    if (!newHabit.trim()) return;
    setLoading(true);
    try {
      await api.post("/api/habits", { name: newHabit.trim() });
      toast.success("Hábito adicionado!");
      setNewHabit("");
      await loadHabits();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar hábito");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleDay(habitId: string, day: number) {
    try {
      await api.put(`/api/habits/${habitId}/toggle`, { day });
      await loadHabits();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar hábito");
    }
  }

  async function handleDeleteHabit(id: string) {
    try {
      await api.delete(`/api/habits/${id}`);
      toast.success("Hábito excluído!");
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir hábito");
    }
  }

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date().getDay();

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Carregando hábitos...
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 sm:top-14 sm:left-14 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] opacity-70" />
        <div className="absolute bottom-10 right-10 sm:bottom-14 sm:right-14 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] bg-accent/10 rounded-full blur-[70px] sm:blur-[90px] opacity-70" />
      </div>

      <div className="h-20 sm:h-24" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          <header className="space-y-3 sm:space-y-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Voltar ao Dashboard
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                  Rastreador de Hábitos
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Construa e monitore seus hábitos diários.
                </p>
              </div>
            </div>
          </header>

          <div className="bg-card/80 backdrop-blur border border-border rounded-2xl shadow-lg flex flex-col gap-6 p-5 sm:p-8">
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="Adicione um novo hábito..."
                  className="flex-grow text-base border border-input rounded-xl p-3 bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                  disabled={loading}
                />
                <button
                  onClick={handleAddHabit}
                  disabled={!newHabit.trim() || loading}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow hover:bg-primary/90 transition"
                >
                  <Plus className="w-5 h-5" />
                  {loading ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Hábito
                    </th>
                    {daysOfWeek.map((day, index) => (
                      <th
                        key={day}
                        className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                          index === today
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-card divide-y divide-border">
                  {habits.length === 0 ? (
                    <tr>
                      <td
                        colSpan={daysOfWeek.length + 2}
                        className="px-4 py-6 text-center text-muted-foreground"
                      >
                        Nenhum hábito adicionado ainda.
                      </td>
                    </tr>
                  ) : (
                    habits.map((habit) => (
                      <tr
                        key={habit.id}
                        className="hover:bg-muted/50 transition-colors group"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          {habit.name}
                        </td>

                        {daysOfWeek.map((_, dayIndex) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (today - dayIndex));
                          const dateKey = date.toISOString().split("T")[0];
                          const checked = habit.completedDays?.[dateKey] || false;
                          const isToday = dayIndex === today;

                          return (
                            <td key={dayIndex} className="px-4 py-4 text-center">
                              <div className="flex justify-center">
                                <button
                                  onClick={() =>
                                    handleToggleDay(habit.id, dayIndex)
                                  }
                                  disabled={!habit.days.includes(dayIndex)}
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                    ${
                                      habit.days.includes(dayIndex)
                                        ? checked
                                          ? "bg-accent border-accent hover:bg-accent/80"
                                          : "border-primary/50 hover:border-primary/80"
                                        : "border-muted-foreground/30 cursor-not-allowed"
                                    }
                                    ${isToday ? "ring-2 ring-primary/50" : ""}
                                  `}
                                >
                                  {checked && (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                  )}
                                </button>
                              </div>
                            </td>
                          );
                        })}

                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-destructive/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}