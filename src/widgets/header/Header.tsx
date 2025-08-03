import { ROUTES } from "@/shared/router/constants";
import { Link } from "react-router-dom";
import { Profile } from "./Profile";

export function Header() {
  return (
    <header className="px-4 flex justify-between items-center bg-gray-800 text-white">
      <Link to={ROUTES.HOME}>Logo</Link>
      <Profile />
    </header>
  );
}
