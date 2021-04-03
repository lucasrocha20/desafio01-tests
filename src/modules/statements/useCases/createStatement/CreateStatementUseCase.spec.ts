import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";


let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  });

  it("should be able create a new deposit for user authenticated", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas Rocha",
      email: "lucas@teste.com",
      password: "1234"
    });

    const result = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(result).toHaveProperty("id");
    expect(getBalance.balance).toBe(20);
  });

  it("should be able create a new withdraw for user authenticated", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas Rocha",
      email: "lucas@teste.com",
      password: "1234"
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 50,
      description: "Test operation",
    });

    const result = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(result).toHaveProperty("id");
    expect(getBalance.balance).toBe(30);
  });
})
