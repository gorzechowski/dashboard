import { MigrationInterface, QueryRunner } from 'typeorm';

export class IgnoreSsl1562593452681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            'INSERT INTO "setting" (name, value, type) VALUES ("ignore-certificate-errors", "0", "switch")',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM "settings" WHERE name = "ignore-certificate-errors"');
    }

}
