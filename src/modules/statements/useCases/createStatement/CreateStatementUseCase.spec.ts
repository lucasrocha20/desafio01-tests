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
  TRANSFER = "transfer",
  SEND_TRANSFER = "send_transfer",
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

  it("should be able create a new transfer of user authenticated", async () => {
    const user = await createUserUseCase.execute({
      name: "Lucas Rocha",
      email: "lucas@teste.com",
      password: "1234"
    });

    const destinationUser = await createUserUseCase.execute({
      name: "Rocha Lucas",
      email: "rocha@teste.com",
      password: "1234"
    });

    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 500,
      description: "deposit",
    });

    const result = await statementsRepositoryInMemory.create({
      sender_id: destinationUser.id,
      user_id: user.id as string,
      type: "send_transfer" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    await statementsRepositoryInMemory.create({
      sender_id: user.id,
      user_id: destinationUser.id as string,
      type: "transfer" as OperationType,
      amount: 20,
      description: "Test operation",
    });

    const getBalance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    const getBalanceDestination = await getBalanceUseCase.execute({
      user_id: destinationUser.id as string
    });

    expect(result).toHaveProperty("id");
    expect(getBalance.balance).toBe(480);
    expect(getBalanceDestination.balance).toBe(20);
  });
})
