"use client";
import { useRouter } from "next/navigation";
import { useNavigation } from "../contexts/NavigationContext";

export function useNavigationWithLoading() {
  const router = useRouter();
  const { setIsNavigating } = useNavigation();

  const navigateTo = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };

  const replace = (path: string) => {
    setIsNavigating(true);
    router.replace(path);
  };

  const back = () => {
    setIsNavigating(true);
    router.back();
  };

  return {
    navigateTo,
    replace,
    back,
    router, // Para casos especiais onde ainda precisam do router original
  };
}
