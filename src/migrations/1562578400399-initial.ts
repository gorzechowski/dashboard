import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class Initial1562578400399 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'setting',
            columns: [
                {
                    name: 'name',
                    type: 'varchar',
                    isPrimary: true,
                    isUnique: true,
                },
                {
                    name: 'value',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: 'tab',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'index',
                    type: 'integer',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'qml',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('setting');
        await queryRunner.dropTable('tab');
    }

}
