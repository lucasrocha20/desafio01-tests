import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  SEND_TRANSFER = 'send_transfer'
}

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}


  async execute({ sender_id, user_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw' || type === 'send_transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    if(type === 'transfer' && !sender_id) {
      throw new AppError("Destination not informed!");
    }

    const destinationUser = await this.usersRepository.findById(sender_id as string);

    if(!destinationUser) {
      throw new AppError("Destination not found!");
    }

    const statementOperation = await this.statementsRepository.create({
      sender_id,
      user_id,
      type: 'send_transfer' as OperationType,
      amount,
      description
    });

    await this.statementsRepository.create({
      sender_id: user_id,
      user_id: sender_id as string,
      type,
      amount,
      description
    });


    return statementOperation;
  }
}
