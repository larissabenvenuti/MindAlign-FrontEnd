export const Footer = () => (
  <footer className="bg-background transition-all duration-300 backdrop-blur-md">
    <div className="container mx-auto px-4 py-6 flex items-center justify-center">
      <div className="text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} MindAlign. — Desenvolvido por:{" "}
        <a
          href="https://github.com/larissabenvenuti"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary hover:underline transition"
        >
          Larissa Benvenuti
        </a>{" "}
        — Todos os direitos reservados.
      </div>
    </div>
  </footer>
);
