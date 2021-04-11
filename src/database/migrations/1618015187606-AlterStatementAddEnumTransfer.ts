import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementAddEnumTransfer1618015187606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn(
        "statements",
        "type",
        new TableColumn({
          name: 'type',
          type: 'enum',
          enum: ['deposit', 'withdraw', 'send_transfer', 'transfer']
        })
      )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn(
        "statements",
        "type",
        new TableColumn({
          name: 'type',
          type: 'enum',
          enum: ['deposit', 'withdraw']
        })
      )
    }

}
