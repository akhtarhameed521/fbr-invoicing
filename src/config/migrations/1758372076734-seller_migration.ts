import { MigrationInterface, QueryRunner } from "typeorm";

export class SellerMigration1758372076734 implements MigrationInterface {
    name = 'SellerMigration1758372076734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "seller" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ntnCnic" character varying(13) NOT NULL, "businessName" character varying(255) NOT NULL, "province" character varying(55) NOT NULL, "city" character varying(55) NOT NULL, "address" character varying(1000) NOT NULL, CONSTRAINT "UQ_1bbf7d1bcd875913c4ea48e4b04" UNIQUE ("ntnCnic"), CONSTRAINT "PK_36445a9c6e794945a4a4a8d3c9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "seller"`);
    }

}
