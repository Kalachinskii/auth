// import { authApi } from "@/entities/user";
import { useUserStore } from "@/entities/user/model/users.store";
import { Button } from "@/shared/ui/button";
import { useSignout } from "../model/useSignout";
import { Toaster } from "sonner";

export function Profile() {
  // вытащить данные с зустанд
  //   const load = useUserStore((state) => state.load);
  // пробросить данные
  //   const changeLoader = useUserStore((state) => state.changeLoader);
  // можно вытащить через деструктизацию - неоптимально
  // const { load, changeLoader } = useUserStore();
  //   console.log(load);
  const user = useUserStore((state) => state.user);
  // const = useSignout();
  const { signoutHandler } = useSignout();

  return (
    <div>
      <Toaster />
      <label className="text-red-700">{user?.email}</label>
      <Button
        // onClick={() => changeLoader()}
        onClick={signoutHandler}
        variant={"outline"}
        className="text-black cursor-pointer ml-3"
      >
        Выйти
      </Button>
    </div>
  );
}
