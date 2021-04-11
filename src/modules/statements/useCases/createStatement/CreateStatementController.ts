import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  SEND_TRANSFER = 'send_transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    let { id: sender_id } = request.params;
    const { id: user_id } = request.user;
    const { amount, description } = request.body;


    sender_id ? sender_id : undefined;

    const splittedPath = request.originalUrl.split('/')
    const type = (sender_id ? splittedPath[splittedPath.length - 2] :
                  splittedPath[splittedPath.length - 1]) as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      sender_id,
      user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
