export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface FetchUserDto {
  id: string; // Used to fetch the user
}
