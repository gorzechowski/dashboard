import { MigrationInterface, QueryRunner } from 'typeorm';

export class IgnoreFrameOriginRemove1562593452793 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DELETE FROM "setting" WHERE name = "ignore-frame-origin-policy"');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            'INSERT INTO "setting" (name, value, type) VALUES ("ignore-frame-origin-policy", "1", "switch")',
        );
    }

}
