import { BaseAppEntity } from "@entities";
import { Column, Entity } from "typeorm";

@Entity("seller")
export class Seller extends BaseAppEntity {
    @Column({ type: "varchar", length: 13, unique: true })
    ntnCnic: string;

    @Column({ type: "varchar", length: 255 })
    businessName: string;

    @Column({ type: "varchar", length: 55 })
    province: string;

    @Column({ type: "varchar", length: 55 })
    city: string;

    @Column({ type: "varchar", length: 1000 }) 
    address: string;
}