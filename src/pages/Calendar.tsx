import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt-br";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, Sparkles, Plus, ArrowLeft } from "lucide-react";
import EventModal from "../components/calendar/EventModal";
import ViewEventModal from "../components/calendar/ViewEventModal";
import { api } from "../lib/api";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
}

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("theme-dark")
      : false
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("theme-dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useIsDarkTheme();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setIsLoading(true);
      const data = await api.get<CalendarEvent[]>("`${import.meta.env.VITE_API_URL}/api/calendar`");
      const normalized = data.map((ev) => {
        let start = new Date(ev.start);
        let end = new Date(ev.end);
        if (end.getHours() === 0 && end.getMinutes() === 0) {
          end.setMinutes(end.getMinutes() - 1);
        }
        return {
          ...ev,
          start: start.toISOString(),
          end: end.toISOString(),
          allDay: false,
        };
      });
      setEvents(normalized);
    } catch {
      toast.error("Erro ao carregar eventos");
    } finally {
      setIsLoading(false);
    }
  }

  function handleDateClick(info: any) {
    setCurrentDate(info.date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }
  function handleEventClick(info: any) {
    const clicked = events.find((e) => e.id === info.event.id);
    setSelectedEvent(clicked || null);
    setIsViewModalOpen(true);
  }
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setCurrentDate(null);
  }
  function handleCloseViewModal() {
    setIsViewModalOpen(false);
    setSelectedEvent(null);
  }
  async function handleSaveEvent(event: any) {
    try {
      await (event.id
        ? api.put(`${import.meta.env.VITE_API_URL}/api/calendar/${event.id}`, { ...event, allDay: false })
        : api.post(`${import.meta.env.VITE_API_URL}/api/calendar`, { ...event, allDay: false }));

      if (event.repeat && !event.id) {
        let repeats: CalendarEvent[] = [];
        const origStart = new Date(event.start);
        const origEnd = new Date(event.end);
        for (let i = 1; i <= 5; i++) {
          let startCopy = new Date(origStart);
          let endCopy = new Date(origEnd);
          if (event.repeat === "weekly") {
            startCopy.setDate(startCopy.getDate() + 7 * i);
            endCopy.setDate(endCopy.getDate() + 7 * i);
          }
          if (event.repeat === "monthly") {
            startCopy.setMonth(startCopy.getMonth() + i);
            endCopy.setMonth(endCopy.getMonth() + i);
          }
          repeats.push({
            ...event,
            start: startCopy.toISOString(),
            end: endCopy.toISOString(),
            allDay: false,
          });
        }
        for (const repeatEv of repeats) {
          await api.post(`${import.meta.env.VITE_API_URL}/api/calendar`, repeatEv);
        }
      }
      await loadEvents();
      setIsModalOpen(false);
      setSelectedEvent(null);
      setCurrentDate(null);
      toast.success("Evento criado!");
    } catch {
      toast.error("Erro ao salvar evento");
    }
  }
  async function handleDeleteEvent(id: string) {
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/api/calendar/${id}`);
      setEvents((events) => events.filter((ev) => ev.id !== id));
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success("Evento excluído!");
    } catch {
      toast.error("Erro ao excluir evento");
    }
  }
  function handleEditEvent(event: any) {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setIsViewModalOpen(false);
  }

  const CalendarSkeleton = () => (
    <div className="h-full flex flex-col gap-2 p-8 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="flex-1 grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded" />
        ))}
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <CalendarIcon className="w-10 h-10 text-primary/40" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Nenhum evento agendado</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        Clique em uma data para adicionar seu primeiro evento
      </p>
      <button
        onClick={() => {
          setCurrentDate(new Date());
          setIsModalOpen(true);
        }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Criar Evento
      </button>
    </div>
  );

  return (
    <section className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-10 left-10 w-[260px] h-[260px] bg-primary/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-16 right-16 w-[220px] h-[220px] bg-accent/10 rounded-full blur-[70px]" />
      </div>
      <div className="h-16 sm:h-20 md:h-24" />
      <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6 lg:px-12 py-5 sm:py-8 md:py-10">
        <div className="space-y-7 md:space-y-9">
          <header className="flex flex-col gap-2 sm:gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition group self-start mb-2"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Voltar ao Dashboard
            </Link>
            <div className="flex items-center gap-4 mb-1">
              <span className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center relative flex-shrink-0">
                <CalendarIcon className="w-7 h-7 text-primary" />
                <Sparkles className="w-4 h-4 text-accent absolute -top-2 -right-2 animate-pulse" />
              </span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Calendário Inteligente
                </h1>
                <p className="text-base text-muted-foreground mt-1">
                  Organize eventos, compromissos e sua rotina de forma visual.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full mt-2">
              <span className="text-sm text-muted-foreground whitespace-normal px-4 py-2 rounded-lg bg-card border border-border w-full md:w-auto mb-2 md:mb-0 text-center">
                {events.length === 0
                  ? "Nenhum evento adicionado ainda."
                  : `${events.length} evento${events.length > 1 ? "s" : ""} adicionados. Clique em uma data para criar outro ou edite qualquer evento clicando nele.`}
              </span>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-card text-foreground font-bold rounded-lg shadow hover:bg-muted transition w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                Criar Evento
              </button>
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <article className="bg-card/70 backdrop-blur border border-border rounded-2xl shadow-lg flex flex-col p-4 sm:p-6 min-h-[420px] sm:min-h-[520px] w-full max-w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full" />
                <h2 className="text-lg font-semibold text-foreground">
                  Visão Mensal
                </h2>
              </div>
              <div className="flex-1 w-full rounded-lg overflow-hidden border border-border bg-background/60 calendar-wrapper">
                {isLoading ? (
                  <CalendarSkeleton />
                ) : events.length === 0 ? (
                  <EmptyState />
                ) : (
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={ptLocale}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "",
                    }}
                    events={events}
                    editable={false}
                    selectable
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="100%"
                    eventClassNames="calendar-event"
                  />
                )}
              </div>
            </article>
            <article className="bg-card/70 backdrop-blur border border-border rounded-2xl shadow-lg flex flex-col p-4 sm:p-6 min-h-[420px] sm:min-h-[520px] w-full max-w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-8 bg-gradient-to-r from-secondary to-primary rounded-full" />
                <h2 className="text-lg font-semibold text-foreground">
                  Visão Diária
                </h2>
              </div>
              <div className="flex-1 w-full rounded-lg overflow-hidden border border-border bg-background/60 calendar-wrapper">
                {isLoading ? (
                  <CalendarSkeleton />
                ) : events.length === 0 ? (
                  <EmptyState />
                ) : (
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    locale={ptLocale}
                    events={events}
                    editable={false}
                    selectable
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="100%"
                    eventClassNames="calendar-event"
                    timeZone="local"
                    scrollTime="08:00:00"
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    allDaySlot={false}
                    dayHeaderFormat={{ weekday: "short", day: "numeric" }}
                  />
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        currentDate={currentDate}
        existingEvent={selectedEvent}
      />
      <ViewEventModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        eventDetails={selectedEvent || {}}
        onSave={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </section>
  );
}
