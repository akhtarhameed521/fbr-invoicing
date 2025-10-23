import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceInvoiceItemsCustomerProductMigrations1758428478734 implements MigrationInterface {
    name = 'InvoiceInvoiceItemsCustomerProductMigrations1758428478734'

    public async up(queryRunner: QueryRunner): Promise<void> {
       // await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ntnCnic" character varying(13) NOT NULL, "businessName" character varying(255) NOT NULL, "province" character varying(55) NOT NULL, "city" character varying(55) NOT NULL, "address" character varying(500) NOT NULL, "registrationType" character varying(20) NOT NULL, CONSTRAINT "UQ_74b95bf20eb55922f5a1efee0d9" UNIQUE ("ntnCnic"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceNumber" character varying(50) NOT NULL, "invoiceType" character varying(50) NOT NULL, "invoiceDate" date NOT NULL DEFAULT ('now'::text)::date, "refNo" character varying(30), "scenarioId" character varying(10), "subtotal" numeric NOT NULL DEFAULT '0', "totalTax" numeric NOT NULL DEFAULT '0', "grandTotal" numeric NOT NULL DEFAULT '0', "InvoiceStatus" character varying(20) NOT NULL DEFAULT 'Draft', "irn" character varying(50), "qrCodeData" text, "fbrResponse" jsonb, "seller_id" integer, "customer_id" integer, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hsCode" character varying(10) NOT NULL, "description" character varying(255) NOT NULL, "uom" character varying(50) NOT NULL, "taxRate" numeric NOT NULL, "saleType" character varying(50) NOT NULL, "fixedPrice" numeric NOT NULL DEFAULT '0', CONSTRAINT "UQ_9a9a5a85d2d2fe2c5bec57b5048" UNIQUE ("hsCode"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice_item" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" numeric(15,4) NOT NULL DEFAULT '1', "unitPrice" numeric NOT NULL, "discount" numeric NOT NULL DEFAULT '0', "valueExclSt" numeric NOT NULL, "salesTaxApplicable" numeric(15,2) NOT NULL, "salesTaxWithheld" numeric NOT NULL DEFAULT '0', "extraTax" numeric NOT NULL DEFAULT '0', "furtherTax" numeric NOT NULL DEFAULT '0', "fedPayable" numeric NOT NULL DEFAULT '0', "sroScheduleNo" character varying(50), "sroItemSerialNo" character varying(50), "invoice_id" integer, "product_id" integer, CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`);
      //  await queryRunner.query(`CREATE TABLE "seller" ("id" SERIAL NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ntnCnic" character varying(13) NOT NULL, "businessName" character varying(255) NOT NULL, "province" character varying(55) NOT NULL, "city" character varying(55) NOT NULL, "address" character varying(1000) NOT NULL, CONSTRAINT "UQ_1bbf7d1bcd875913c4ea48e4b04" UNIQUE ("ntnCnic"), CONSTRAINT "PK_36445a9c6e794945a4a4a8d3c9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_e04555367efe6ce8b43342831fe" FOREIGN KEY ("seller_id") REFERENCES "seller"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_2e6c81055e67a7f4791c887b56f" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_9830c1881dd701d440c2164c3cd" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_7e6e8d3c1449a7ec83b2b5491f6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_7e6e8d3c1449a7ec83b2b5491f6"`);
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_9830c1881dd701d440c2164c3cd"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_2e6c81055e67a7f4791c887b56f"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_e04555367efe6ce8b43342831fe"`);
        await queryRunner.query(`DROP TABLE "seller"`);
        await queryRunner.query(`DROP TABLE "invoice_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
