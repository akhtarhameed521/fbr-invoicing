import { BaseAppEntity } from "@entities";
import { Column, Entity } from "typeorm";

@Entity("product")
export class Product extends BaseAppEntity {
    @Column({ type: "varchar", length: 10,  unique: true })
    hsCode: string;

    @Column({ type: "varchar", length: 255, })
    description: string;

    @Column({ type: "varchar", length: 50, })
    uom: string; // Unit of Measure, e.g., 'Numbers', 'Kg'

    @Column({ type: "decimal" })
    taxRate: number; // e.g., 18.00

    @Column({ type: "varchar", length: 50,   })
    saleType: string;

    @Column({ type: "decimal", default: 0.00 })
    fixedPrice: number;
}