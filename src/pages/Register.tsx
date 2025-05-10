import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import { UserPlus } from "lucide-react";
import { authAtom } from "../state/atoms";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { authService } from "../services/auth";
import { toast } from "react-toastify";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await authService.register(email, password, name);
      setAuth({ user, isLoading: false, error: null });
      toast.success(`Successfully Registered as ${email}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Register to start managing your crypto wallets
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && <p className="text-sm text-error-500">{error}</p>}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              icon={<UserPlus size={18} />}
            >
              Register
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-accent-600 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
