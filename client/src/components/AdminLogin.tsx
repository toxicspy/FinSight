import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

// ✅ ADMIN PASSWORD (CHANGE THIS)
const ADMIN_PASSWORD = "admin@123";

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid admin password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">Admin Access</CardTitle>
          <CardDescription>
            Enter your administrator password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button type="submit" className="w-full">
              Login to CMS
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
