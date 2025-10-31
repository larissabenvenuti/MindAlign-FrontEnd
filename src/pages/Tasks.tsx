import { useState, useEffect } from "react";
import { Trash2, Plus, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const MAX_CHARACTERS = 80;

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await api.get<Task[]>(`/api/tasks`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
      toast.error("Erro ao carregar tarefas");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask() {
    if (!newTask.trim()) return;

    try {
      await api.post(`/api/tasks`, {
        text: newTask.trim().slice(0, MAX_CHARACTERS),
      });
      setNewTask("");
      await loadTasks();
      toast.success("Tarefa adicionada!");
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
      toast.error("Erro ao adicionar tarefa");
    }
  }

  async function handleToggleTask(id: string) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      setUpdatingId(id);
      await api.patch(`/api/tasks/${id}/toggle`, {});
    } catch (err) {
      console.error("Erro ao alternar tarefa:", err);
      await loadTasks();
      toast.error("Erro ao alternar tarefa");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteTask(id: string) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));

    try {
      setUpdatingId(id);
      await api.delete(`/api/tasks/${id}`);
      toast.success("Tarefa excluída!");
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
      await loadTasks();
      toast.error("Erro ao excluir tarefa");
    } finally {
      setUpdatingId(null);
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  if (loading) {
    return (
      <section className="relative w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p>Carregando tarefas...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 sm:top-14 sm:right-14 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] opacity-70" />
        <div className="absolute bottom-10 left-10 sm:bottom-14 sm:left-14 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] bg-accent/10 rounded-full blur-[70px] sm:blur-[90px] opacity-70" />
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
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                  Lista de Tarefas
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Organize suas tarefas diárias de forma simples
                </p>
              </div>
            </div>
          </header>
          <div className="bg-card/80 backdrop-blur border border-border rounded-2xl shadow-lg flex flex-col gap-6 p-5 sm:p-8">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={newTask}
                  onChange={(e) =>
                    setNewTask(e.target.value.slice(0, MAX_CHARACTERS))
                  }
                  maxLength={MAX_CHARACTERS}
                  placeholder="Adicione uma nova tarefa..."
                  className="flex-grow text-base"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  disabled={updatingId !== null}
                />
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.trim() || updatingId !== null}
                  className="gap-2 shadow-lg"
                  size="lg"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar
                </Button>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>
                  {newTask.length}/{MAX_CHARACTERS} caracteres
                </span>
                <span>
                  Concluídas: {completedCount} / {tasks.length}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.length > 0 ? (
                tasks.map(({ id, text, completed }) => (
                  <div
                    key={id}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition-all group"
                  >
                    <button
                      onClick={() => handleToggleTask(id)}
                      disabled={updatingId === id}
                      className="flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                    <span
                      className={`flex-grow text-base ${
                        completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground font-medium"
                      }`}
                    >
                      {text}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(id)}
                      disabled={updatingId === id}
                      className="flex-shrink-0 text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium">
                    Nenhuma tarefa pendente!
                  </p>
                  <p className="text-sm">
                    Adicione uma nova tarefa acima para começar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
