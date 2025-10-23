import { BaseAppEntity, Invoice, Product } from "@entities";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";


@Entity("invoice_item")
export class InvoiceItem extends BaseAppEntity {
    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    @JoinColumn({ name: "invoice_id" })
    invoice: Invoice;

    @ManyToOne(() => Product, (product) => product.id)
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ type: "decimal", precision: 15, scale: 4, default: 1.0000 })
    quantity: number;

    @Column({ type: "decimal",  })
    unitPrice: number;

    @Column({ type: "decimal",  default: 0.00 })
    discount: number;

    @Column({ type: "decimal",  })
    valueExclSt: number; // Sales value excluding tax

    @Column({ type: "decimal", precision: 15, scale: 2, })
    salesTaxApplicable: number; // Main sales tax/FED

    @Column({ type: "decimal",  default: 0.00 })
    salesTaxWithheld: number;

    @Column({ type: "decimal",  default: 0.00 })
    extraTax: number;

    @Column({ type: "decimal",  default: 0.00 })
    furtherTax: number;

    @Column({ type: "decimal",  default: 0.00 })
    fedPayable: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    sroScheduleNo: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    sroItemSerialNo: string;
}