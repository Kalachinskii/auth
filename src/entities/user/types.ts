export interface IUserPrivate {
  id: number;
  email: string;
  password: string;
}

export interface IUserPublic {
  id: IUserPrivate["id"];
  email: IUserPrivate["email"];
}
