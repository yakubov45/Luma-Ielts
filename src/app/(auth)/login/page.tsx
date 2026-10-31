import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Kirish | lumoielts.uz",
  description: "Lumo IELTS platformasiga kirish va o‘quv jarayonini davom ettirish.",
};

export default function LoginPage() {
  return <AuthCard initialMode="login" />;
}
