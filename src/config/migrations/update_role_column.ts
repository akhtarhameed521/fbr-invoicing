// import { MigrationInterface, QueryRunner } from "typeorm";

// export class UpdateRegisterUnit1755166997458 implements MigrationInterface {
//     name = 'UpdateRegisterUnit1755166997458'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "register_unit" ADD "role" character varying NOT NULL DEFAULT 'User'`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "register_unit" DROP COLUMN "role"`);
//     }

// }
