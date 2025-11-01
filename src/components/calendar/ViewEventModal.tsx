import { X, Calendar, Clock, Trash2, Edit } from "lucide-react";
import { Button } from "../ui/Button";

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDetails: any;
  onSave: (event: any) => void;
  onDelete: (id: string) => void;
}

export default function ViewEventModal({
  isOpen,
  onClose,
  eventDetails,
  onSave,
  onDelete,
}: ViewEventModalProps) {
  if (!isOpen || !eventDetails) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString.replace("Z", ""));
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-card/90 border border-border backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg p-7 md:p-8 space-y-6 animate-scale-in overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-accent/25 rounded-full blur-3xl" />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 relative z-10">
          <span className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
            <Calendar className="w-6 h-6 text-primary-foreground" />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Detalhes do Evento
          </h2>
        </div>
        <p className="text-sm text-muted-foreground relative z-10">
          Visualize, edite ou exclua seu evento abaixo.
        </p>
        <div className="relative z-10 space-y-5 pt-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {eventDetails.title}
            </h3>
            {eventDetails.repeat && (
              <p className="text-sm text-primary font-medium">
                Repetição:{" "}
                {eventDetails.repeat === "weekly"
                  ? "Semanal"
                  : eventDetails.repeat === "monthly"
                  ? "Mensal"
                  : "Não repetido"}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 border border-border rounded-lg p-4 bg-background/50">
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm">
                <strong>Início:</strong> {formatDate(eventDetails.start)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm">
                <strong>Término:</strong> {formatDate(eventDetails.end)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-5 relative z-10">
          <Button
            onClick={() => onSave(eventDetails)}
            className="rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Editar
          </Button>
          <Button
            onClick={() => onDelete(eventDetails.id)}
            className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
