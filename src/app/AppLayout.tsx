import { Header } from "@/widgets/header";
import { Profile } from "@/widgets/profile/indec";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <Header profile={<Profile />} />
      {/* компанент страницы - поступает дочерний элемент роута */}
      <Outlet />
      {/* <h2>Footer</h2> */}
    </>
  );
}
