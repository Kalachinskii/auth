// import type { ReactNode } from "react";

export function FormPagesLayoutBox({
  title,
  form,
}: {
  title: string;
  //   form: ReactNode;
  form: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <main className="border border-zinc-500 rounded-xl bg-blue-200/10 px-8 pt-8 pb-14 min-w-[300px]">
        <h1 className="text-4xl text-white">{title}</h1>
        {form}
      </main>
    </div>
  );
}
