// npm i zustand
import { useUserStore } from "@/entities/user";
import type { IUserPublic } from "@/entities/user/types";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export function Home() {
  const { user } = useLoaderData<{ user: IUserPublic }>();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user]);

  return <div>Home</div>;
}
