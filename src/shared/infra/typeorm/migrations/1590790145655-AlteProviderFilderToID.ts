import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, QueryBuilder, Table } from "typeorm";

export class AlteProviderFilderToID1590790145655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('appointments', 'provider');

      await queryRunner.addColumn(
        'appointments',
        new TableColumn({
          name: 'provider_id',
          type: 'uuid',
          isNullable: true, // CASCADE regra de negócio - não perde dados sem este campo
        }),
      );

      await queryRunner.createForeignKey(
        'appointments',
        new TableForeignKey({
          name: 'AppointmentProvider',
          columnNames: ['provider_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

      await queryRunner.dropColumn('appointments', 'provider_id');

      await queryRunner.addColumn('appointments', new TableColumn({
        name: 'provider',
        type: 'varchar',
      }),
    );
  }
}
