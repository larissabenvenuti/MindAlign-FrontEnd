import { useState, useEffect } from "react";
import { Save, Trash2, BookOpen, PenLine, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const MAX_CHARACTERS = 500;

interface Note {
  id: string;
  content: string;
  date: string;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
}

export default function Notes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await fetch("/api/notes", {
        credentials: "include",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Erro ao buscar notas");
      setNotes(await res.json());
    } catch (err) {
      toast.error("Erro ao buscar notas");
    }
  }

  async function handleSaveNote() {
    if (!note.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
        body: JSON.stringify({ content: note.trim() }),
      });
      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        toast.error(errorJson.error || "Erro ao salvar nota!");
        return;
      }
      toast.success("Nota salva com sucesso!");
      setNote("");
      await loadNotes();
    } catch (err) {
      toast.error("Erro de conexão ao salvar nota.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: authHeaders(),
      });
      if (!response.ok) {
        toast.error("Erro ao excluir nota!");
        return;
      }
      toast.success("Nota excluída!");
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast.error("Erro de conexão ao excluir nota.");
    }
  }

  return (
    <section className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 sm:top-14 sm:left-14 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-secondary/20 rounded-full blur-[80px] sm:blur-[100px] opacity-70" />
        <div className="absolute bottom-10 right-10 sm:bottom-14 sm:right-14 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] bg-muted/20 rounded-full blur-[70px] sm:blur-[90px] opacity-70" />
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
                <span className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center relative flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-primary" />
                  <PenLine className="w-4 h-4 text-accent absolute -top-2 -right-2 animate-pulse" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                  Anotações Rápidas
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Salve links, ideias ou notas importantes no seu painel.
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <article className="bg-card border border-border rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col p-5 sm:p-6 min-h-[400px] sm:min-h-[450px]">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="h-1 w-6 sm:w-8 bg-gradient-to-r from-secondary to-primary rounded-full" />
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Criar Nova Nota
                </h2>
              </div>

              <textarea
                value={note}
                onChange={(e) =>
                  setNote(e.target.value.slice(0, MAX_CHARACTERS))
                }
                maxLength={MAX_CHARACTERS}
                placeholder="Escreva sua nota aqui..."
                rows={8}
                className="
                  flex-1 w-full 
                  border border-input rounded-xl 
                  p-3 sm:p-4 
                  text-sm sm:text-base 
                  bg-background text-foreground 
                  placeholder:text-muted-foreground
                  outline-none 
                  transition-all duration-200
                  focus:ring-2 focus:ring-ring focus:border-transparent
                  resize-none
                  min-h-[200px] sm:min-h-[240px]
                "
                aria-label="Campo de texto para nova nota"
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mt-4">
                <span className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                  {note.length}/{MAX_CHARACTERS} caracteres
                </span>
                <Button
                  onClick={handleSaveNote}
                  disabled={!note.trim() || loading}
                  className="w-full sm:w-auto gap-2 shadow-lg order-1 sm:order-2"
                  size="lg"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  {loading ? "Salvando..." : "Salvar Nota"}
                </Button>
              </div>
            </article>

            <article className="bg-card border border-border rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col p-5 sm:p-6 min-h-[400px] sm:min-h-[450px]">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <div className="h-1 w-6 sm:w-8 bg-gradient-to-r from-primary to-secondary rounded-full" />
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Histórico de Notas
                </h2>
              </div>

              {notes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                    <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground text-center">
                    Nenhuma anotação salva ainda.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  {notes.map((entry) => (
                    <div
                      key={entry.id}
                      className="
                        bg-secondary/10 border border-border/50 
                        rounded-xl p-3 sm:p-4 
                        flex gap-3 sm:gap-4
                        shadow-sm hover:shadow-md 
                        transition-all duration-200
                        group
                      "
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <time className="block text-xs sm:text-sm text-muted-foreground font-medium">
                          {new Date(entry.date).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                        <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap leading-relaxed break-words">
                          {entry.content}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(entry.id)}
                        className="
                          flex-shrink-0 self-start
                          text-destructive 
                          opacity-0 group-hover:opacity-100
                          sm:opacity-0 sm:group-hover:opacity-100
                          transition-opacity duration-200
                          p-2 rounded-lg 
                          hover:bg-destructive/10
                          focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/50
                        "
                        aria-label="Excluir nota"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
