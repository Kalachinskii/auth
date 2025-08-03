import { Header } from "@/widgets/header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <Header />
      {/* компанент страницы - поступает дочерний элемент роута */}
      <Outlet />
      {/* <h2>Footer</h2> */}
    </>
  );
}
