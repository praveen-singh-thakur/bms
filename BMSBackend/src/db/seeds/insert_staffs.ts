import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid"; // for generating UUIDs
export async function seed(knex: Knex): Promise<void> {
    // Start a transaction to ensure all data is inserted together
    await knex.transaction(async (trx) => {
        // Step 1: Delete existing entries in 'staffs' and reset AUTO_INCREMENT
        await trx("staffs").del(); // Delete existing entries in 'staffs' table
        await trx.raw("ALTER TABLE staffs AUTO_INCREMENT = 1"); // Reset AUTO_INCREMENT for 'staffs' table

        // Step 2: Fetch the SuperAdmin role ID
        const [superAdminRole] = await trx("roles")
            .select("id")
            .where("name", "superadmin");

        // Check if we found the SuperAdmin role
        if (!superAdminRole) {
            throw new Error("SuperAdmin role not found.");
        }


        // Step 3: Insert staff records
        await trx("staffs").insert([
            {
                uuid: uuidv4(),
                first_name: "Praveen",
                last_name: "Thakur",
                email: "praveensinghsendhav2002@gmail.com",
                country_code: "+91",
                phone: "7225955494",
                password: "$2b$10$Oq9k3bOsTiRRKVsKs3a1GOOj8sTOWWFsYMvTSMfF.gOUI504wVOsS", // You should hash the password securely
                profile_url: "http://example.com/profile1.jpg",
                date_register: trx.fn.now(),
                last_login: null,
                status: 1, // Assuming 1 means active
                role: superAdminRole.id, // Assign SuperAdmin role ID
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            }
        ]);

        // Verify data insertion
        const insertedStaff = await trx("staffs").select("*");
        console.log("Inserted staff records:", insertedStaff);
    });
}
