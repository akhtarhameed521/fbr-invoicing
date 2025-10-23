import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { RegisterUnitEntity } from "@entities";
import { UserRoles } from "@types";
import * as bcrypt from "bcrypt";

export default class AdminSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const repository = dataSource.getRepository(RegisterUnitEntity);

    // Check if admin already exists to avoid duplicates
    const existingAdmin = await repository.findOneBy({ email: "admin@smartsociety.com" });
    if (existingAdmin) {
      console.log("Admin user already exists, skipping seeding.");
      return;
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin user
    const admin = repository.create({
      fullname: "Admin User",
      email: "admin@smartsociety.com",
      phone: "03331234567",
      cnic: "12345-6789012-3",
      password: hashedPassword,
      block: 1,
      unitNo: 1,
      totalMembers: 1,
      role: UserRoles.Admin,
      vehicle: [],
    });

    // Save the admin user to the database
    await repository.save(admin);
    console.log("Admin user seeded successfully.");
  }
}