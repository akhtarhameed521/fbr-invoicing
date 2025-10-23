import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerMigration1758372336179 implements MigrationInterface {
    name = 'CustomerMigration1758372336179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ntnCnic" character varying(13) NOT NULL, "businessName" character varying(255) NOT NULL, "province" character varying(55) NOT NULL, "city" character varying(55) NOT NULL, "address" character varying(500) NOT NULL, "registrationType" character varying(20) NOT NULL, CONSTRAINT "UQ_74b95bf20eb55922f5a1efee0d9" UNIQUE ("ntnCnic"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
       // await queryRunner.query(`CREATE TABLE "seller" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ntnCnic" character varying(13) NOT NULL, "businessName" character varying(255) NOT NULL, "province" character varying(55) NOT NULL, "city" character varying(55) NOT NULL, "address" character varying(1000) NOT NULL, CONSTRAINT "UQ_1bbf7d1bcd875913c4ea48e4b04" UNIQUE ("ntnCnic"), CONSTRAINT "PK_36445a9c6e794945a4a4a8d3c9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       // await queryRunner.query(`DROP TABLE "seller"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
