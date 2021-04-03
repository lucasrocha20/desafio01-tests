import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas Rocha",
      email: "lucas@teste.com",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
  });
})
