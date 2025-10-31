import { useEffect, useState } from "react";
import { Trash2, Plus, Target, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  weekData: boolean[];
}

const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitName, setHabitName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    try {
      setLoading(true);
      const data = await api.get<Habit[]>("/api/habits");
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar hábitos:", err);
      toast.error("Não foi possível carregar os hábitos");
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddHabit() {
    if (!habitName.trim()) return;

    try {
      await api.post<Habit>("/api/habits", { name: habitName });
      setHabitName("");
      await loadHabits();
      toast.success("Hábito adicionado com sucesso");
    } catch (err) {
      console.error("Erro ao adicionar hábito:", err);
      toast.error("Não foi possível adicionar o hábito");
    }
  }

  async function handleToggleCheckbox(habitId: string, dayIdx: number) {
    setHabits((prevHabits) =>
      prevHabits.map((h) => {
        if (h.id === habitId) {
          const newWeekData = [...h.weekData];
          newWeekData[dayIdx] = !newWeekData[dayIdx];
          return { ...h, weekData: newWeekData };
        }
        return h;
      })
    );

    try {
      setUpdatingId(habitId);
      await api.put(`/api/habits/${habitId}/toggle`, { day: dayIdx });
    } catch (err) {
      console.error("Erro ao atualizar hábito:", err);
      await loadHabits();
      toast.error("Não foi possível atualizar o hábito");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteHabit(habitId: string) {
    try {
      setUpdatingId(habitId);
      await api.delete<void>(`/api/habits/${habitId}`);
      setHabits((habits) => habits.filter((h) => h.id !== habitId));
      toast.success("Hábito removido com sucesso");
    } catch (err) {
      console.error("Erro ao deletar hábito:", err);
      toast.error("Não foi possível remover o hábito");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <section className="relative w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p>Carregando hábitos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 sm:top-14 sm:left-14 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] opacity-70" />
        <div className="absolute bottom-10 right-10 sm:bottom-14 sm:right-14 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] bg-secondary/20 rounded-full blur-[70px] sm:blur-[90px] opacity-70" />
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                  Rastreamento de Hábitos
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Acompanhe seus hábitos ao longo da semana
                </p>
              </div>
            </div>
          </header>
          <div className="bg-card/80 backdrop-blur border border-border rounded-2xl shadow-lg flex flex-col gap-6 p-5 sm:p-8">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
              <Input
                type="text"
                placeholder="Adicionar novo hábito"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="flex-grow text-base"
                onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
                disabled={updatingId !== null}
              />
              <Button
                onClick={handleAddHabit}
                disabled={!habitName.trim() || updatingId !== null}
                className="gap-2 shadow-lg w-full md:w-auto"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </Button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-inner bg-background/60">
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-muted/50 text-foreground border-b border-border">
                    <th className="py-4 px-4 text-left font-bold">Hábito</th>
                    {daysOfWeek.map((day) => (
                      <th
                        key={day}
                        className="py-4 px-3 text-sm font-semibold text-muted-foreground"
                      >
                        {day}
                      </th>
                    ))}
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {habits.length === 0 ? (
                    <tr>
                      <td colSpan={daysOfWeek.length + 2} className="py-12">
                        <div className="text-center text-muted-foreground space-y-3">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Target className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                          </div>
                          <p className="font-medium">Sem hábitos cadastrados</p>
                          <p className="text-sm">
                            Adicione um hábito acima para começar
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    habits.map((habit) => (
                      <tr
                        key={habit.id}
                        className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-4 px-4 font-semibold text-left text-foreground">
                          {habit.name}
                        </td>
                        {habit.weekData.map((checked, dayIdx) => (
                          <td key={dayIdx} className="py-4 px-3">
                            <div className="flex justify-center">
                              <button
                                onClick={() =>
                                  handleToggleCheckbox(habit.id, dayIdx)
                                }
                                disabled={updatingId === habit.id}
                                className={`w-6 h-6 rounded-lg border-2 transition-all ${
                                  checked
                                    ? "bg-accent border-accent"
                                    : "border-muted-foreground/30 hover:border-accent/50"
                                } ${
                                  updatingId === habit.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {checked && (
                                  <svg
                                    className="w-full h-full text-white p-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </td>
                        ))}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            disabled={updatingId === habit.id}
                            className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
