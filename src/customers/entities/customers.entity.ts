import { BaseAppEntity } from "@entities";
import { Column, Entity } from "typeorm";

@Entity("customer")
export class Customer extends BaseAppEntity {
    @Column({ type: "varchar", length: 13,  unique: true })
    ntnCnic: string;

    @Column({ type: "varchar", length: 255, })
    businessName: string;

    @Column({ type: "varchar", length: 55, })
    province: string;

    @Column({ type: "varchar", length: 55, })
    city: string;

    @Column({ type: "varchar", length: 500, })
    address: string;

    @Column({ type: "varchar", length: 20, })
    registrationType: string; // e.g., 'Registered', 'Unregistered'
}