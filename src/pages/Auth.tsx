import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { GoogleButton } from "../components/ui/GoogleButton";
import { Check, X } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PasswordStrength {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const { login, register, loginWithGoogle, loading, booted } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.remove(
      "theme-rosa",
      "theme-verde",
      "theme-sol",
      "theme-dark"
    );
  }, []);

  function validatePasswordStrength(password: string) {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      validatePasswordStrength(newPassword);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLogin) {
      try {
        await login(email, password);
        toast("Login realizado! Bem-vindo de volta ao MindAlign.");
        navigate("/dashboard");
      } catch (err: any) {
        toast(err.message || "Dados inválidos!");
      }
    } else {
      if (password !== confirmPassword) {
        toast("As senhas não coincidem!");
        return;
      }
      const allValid = Object.values(passwordStrength).every((v) => v);
      if (!allValid) {
        toast("A senha não atende aos requisitos mínimos!");
        return;
      }
      try {
        await register(name, email, password);
        toast("Conta criada! Faça login para continuar.");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } catch (err: any) {
        toast(err.message || "Erro ao cadastrar!");
      }
    }
  }

  function PasswordRequirement({ met, text }: PasswordRequirementProps) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {met ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <X className="w-4 h-4 text-muted-foreground" />
        )}
        <span className={met ? "text-green-600" : "text-muted-foreground"}>
          {text}
        </span>
      </div>
    );
  }

  if (!booted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[700px]">
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-primary to-accent text-white flex flex-col items-center justify-center px-8 py-12 text-center relative overflow-hidden min-h-[260px]">
          <div
            className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{
              opacity: isLogin ? 1 : 0,
              pointerEvents: isLogin ? "auto" : "none",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Olá, Bem-vindo!</h2>
            <p className="mb-6 text-white/90">Ainda não tem uma conta?</p>
            <button
              onClick={() => setIsLogin(false)}
              className="bg-white text-primary font-bold px-6 py-2 rounded-full shadow-lg hover:bg-white/90 transition-all hover:scale-105"
            >
              Cadastrar
            </button>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
            style={{
              opacity: isLogin ? 0 : 1,
              pointerEvents: isLogin ? "none" : "auto",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
            <p className="mb-6 text-white/90">Já tem uma conta?</p>
            <button
              onClick={() => {
                setIsLogin(true);
                setPassword("");
                setConfirmPassword("");
              }}
              className="bg-white text-primary font-bold px-6 py-2 rounded-full shadow-lg hover:bg-white/90 transition-all hover:scale-105"
            >
              Entrar
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-card flex items-center justify-center px-6 sm:px-8 py-8 overflow-y-auto">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
              {isLogin ? "Acessar sua conta" : "Criar sua conta"}
            </h2>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-4"
            >
              {!isLogin && (
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-muted-foreground mb-1 block"
                  >
                    Nome completo
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              )}
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-muted-foreground mb-1 block"
                >
                  E-mail
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-muted-foreground mb-1 block"
                >
                  Senha
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder={isLogin ? "Sua senha" : "Crie uma senha forte"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full"
                  required
                />
              </div>
              {!isLogin && (
                <>
                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-muted-foreground mb-1 block"
                    >
                      Confirmar senha
                    </Label>
                    <Input
                      type="password"
                      id="confirmPassword"
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full"
                      required
                    />
                    {confirmPassword && (
                      <p
                        className={`text-xs mt-1 ${
                          password === confirmPassword
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      >
                        {password === confirmPassword
                          ? "✓ As senhas coincidem"
                          : "✗ As senhas não coincidem"}
                      </p>
                    )}
                  </div>
                  {password && (
                    <div className="bg-muted p-3 rounded-lg space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Requisitos da senha:
                      </p>
                      <PasswordRequirement
                        met={passwordStrength.minLength}
                        text="Mínimo de 8 caracteres"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasUpperCase}
                        text="Uma letra maiúscula"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasLowerCase}
                        text="Uma letra minúscula"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasNumber}
                        text="Um número"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasSpecial}
                        text="Um caractere especial (!@#$%...)"
                      />
                    </div>
                  )}
                </>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground py-5 sm:py-6 rounded-full font-bold text-base md:text-lg shadow-lg hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading
                  ? isLogin
                    ? "Entrando..."
                    : "Cadastrando..."
                  : isLogin
                  ? "Entrar"
                  : "Cadastrar"}
              </Button>
            </form>
            {isLogin && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Ou
                    </span>
                  </div>
                </div>
                <GoogleButton
                  onSuccess={async (token) => {
                    try {
                      await loginWithGoogle(token);
                      toast("Login Google realizado!");
                      navigate("/dashboard");
                    } catch (err: any) {
                      toast("Erro ao autenticar com Google.");
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
