import { BaseAppEntity, Customer, InvoiceItem, Seller } from "@entities";
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from "typeorm";


@Entity("invoice")
export class Invoice extends BaseAppEntity {
    @Column({ type: "varchar", length: 50, })
    invoiceNumber: string; // Auto-generated or manual, e.g., 'INV-2025-001'

    @Column({ type: "varchar", length: 50, })
    invoiceType: string; // e.g., 'Sale Invoice', 'Debit Note'

    @Column({ type: "date",  default: () => "CURRENT_DATE" })
    invoiceDate: Date;

    @Column({ type: "varchar", length: 30, nullable: true })
    refNo: string; // For debit notes

    @Column({ type: "varchar", length: 10, nullable: true })
    scenarioId: string; // Sandbox only

    @Column({ type: "decimal",  default: 0.00 })
    subtotal: number;

    @Column({ type: "decimal",  default: 0.00 })
    totalTax: number;

    @Column({ type: "decimal",  default: 0.00 })
    grandTotal: number;

    @Column({ type: "varchar", length: 20,  default: "Draft" })
    InvoiceStatus: string; // e.g., 'draft', 'submitted', 'error'

    @Column({ type: "varchar", length: 50, nullable: true })
    irn: string; // Invoice Reference Number

    @Column({ type: "text", nullable: true })
    qrCodeData: string; // QR code string or URL

    @Column({ type: "jsonb", nullable: true })
    fbrResponse: object; // Store FBR API response

    @ManyToOne(() => Seller, (seller) => seller.id)
    @JoinColumn({ name: "seller_id" })
    seller: Seller;

    @ManyToOne(() => Customer, (customer) => customer.id)
    @JoinColumn({ name: "customer_id" })
    customer: Customer;

    @OneToMany(() => InvoiceItem, (item) => item.invoice)
    items: InvoiceItem[];
}