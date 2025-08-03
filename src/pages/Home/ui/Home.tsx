import { useUser } from "../model/useUser";

export function Home() {
  useUser();

  return <div>Home</div>;
}
