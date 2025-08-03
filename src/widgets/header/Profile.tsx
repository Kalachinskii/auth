import { useUserStore } from "@/entities/user/model/users.store";
import { Button } from "@/shared/ui/button";

export function Profile() {
  // вытащить данные с зустанд
  //   const load = useUserStore((state) => state.load);
  // пробросить данные
  //   const changeLoader = useUserStore((state) => state.changeLoader);
  // можно вытащить через деструктизацию - неоптимально
  // const { load, changeLoader } = useUserStore();
  //   console.log(load);
  const user = useUserStore((state) => state.user);

  return (
    <div>
      <label className="text-red-700">{user?.email}</label>
      <Button
        // onClick={() => changeLoader()}
        onClick={() => console.log("Exit")}
        variant={"outline"}
        className="text-black cursor-pointer ml-3"
      >
        Выйти
      </Button>
    </div>
  );
}
