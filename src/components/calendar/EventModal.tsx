import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { X, Calendar, Clock, Repeat } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  currentDate?: Date | null;
  existingEvent?: any;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  currentDate,
  existingEvent,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [repeat, setRepeat] = useState("");

  useEffect(() => {
    function formatDateTime(dateString: string) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    if (existingEvent) {
      setTitle(existingEvent.title || "");
      setStart(formatDateTime(existingEvent.start));
      setEnd(formatDateTime(existingEvent.end));
      setRepeat(existingEvent.repeat || "");
    } else if (currentDate) {
      const date = new Date(currentDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      setStart(`${year}-${month}-${day}T${hours}:${minutes}`);
      setEnd(`${year}-${month}-${day}T${hours}:${minutes}`);
      setTitle("");
      setRepeat("");
    }
  }, [isOpen, currentDate, existingEvent]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      {" "}
      <div className="relative bg-card/90 border border-border backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg p-7 md:p-8 space-y-7 animate-scale-in overflow-hidden">
        {" "}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/25 rounded-full blur-3xl" />{" "}
        <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-accent/25 rounded-full blur-3xl" />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <span className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
            <Calendar className="w-6 h-6 text-primary-foreground" />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {existingEvent ? "Editar Evento" : "Novo Evento"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 relative z-10">
          {existingEvent
            ? "Atualize as informações do seu evento abaixo."
            : "Preencha os detalhes para criar um novo evento."}
        </p>
        <form
          className="space-y-5 relative z-10"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              id: existingEvent?.id,
              title,
              start: start ? `${start}:00` : undefined,
              end: end ? `${end}:00` : undefined,
              repeat,
            });
          }}
        >
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="font-semibold text-foreground flex items-center gap-2"
            >
              <span className="text-primary">●</span> Título do evento
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Ex: Reunião semanal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="start"
                className="font-semibold flex gap-2 items-center text-foreground"
              >
                <Clock className="w-4 h-4 text-secondary" /> Início
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="end"
                className="font-semibold flex gap-2 items-center text-foreground"
              >
                <Clock className="w-4 h-4 text-accent" /> Término
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="repeat"
              className="font-semibold flex items-center gap-2 text-foreground"
            >
              <Repeat className="w-4 h-4 text-primary" /> Repetição
            </Label>
            <select
              id="repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            >
              <option value="">Não repetir</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg border-border text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow"
            >
              {existingEvent ? "Salvar alterações" : "Criar evento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
