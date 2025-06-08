import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <h2>Header</h2>
      {/* компанент страницы - поступает дочерний элемент роута */}
      <Outlet />
      <h2>Footer</h2>
    </>
  );
}
