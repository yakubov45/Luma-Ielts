import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Ro‘yxatdan o‘tish | lumoielts.uz",
  description: "Lumo IELTS platformasida yangi hisob yaratish va tayyorgarlikni boshlash.",
};

export default function SignupPage() {
  return <AuthCard initialMode="signup" />;
}
