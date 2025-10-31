import { CheckSquare, Calendar, StickyNote, Target } from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Tarefas",
    description: "Organize suas atividades do dia",
    color: "from-yellow-400 to-orange-400",
  },
  {
    icon: Calendar,
    title: "Eventos",
    description: "Gerencie compromissos importantes",
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: StickyNote,
    title: "Anotações",
    description: "Capture ideias rapidamente",
    color: "from-green-400 to-teal-400",
  },
  {
    icon: Target,
    title: "Hábitos",
    description: "Construa rotinas saudáveis",
    color: "from-blue-400 to-cyan-400",
  },
];

export const Features = () => {
  return (
    <section
      id="funcionalidades"
      className="py-24 md:mt-[-70px] mt-0 bg-background transition-all duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(262_83%_58%_/_0.15)] cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
