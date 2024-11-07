import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid"; // for generating UUIDs

export async function seed(knex: Knex): Promise<void> {
    // Start a transaction to ensure all data is inserted together
    await knex.transaction(async (trx) => {
        // Step 1: Delete existing entries from 'roles' and reset AUTO_INCREMENT
        await trx("roles").del(); // Delete existing entries in 'roles' table
        await trx.raw("ALTER TABLE roles AUTO_INCREMENT = 1"); // Reset AUTO_INCREMENT for 'roles' table

        // Insert new roles
        await trx("roles").insert([
            {
                uuid: uuidv4(),
                name: "superadmin",
                description: "Full access to all features and settings.",
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            },
            {
                uuid: uuidv4(),
                name: "admin",
                description: "Partial access to all features and settings.",
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            }
        ]);

        // Fetch the inserted roles to get their ids
        const [superAdminRole, adminRole] = await trx("roles").select("id", "name").whereIn("name", ["SuperAdmin", "Admin"]);

        // Step 2: Delete existing entries from 'permissions' and reset AUTO_INCREMENT
        await trx("permissions").del(); // Delete existing entries in 'permissions' table
        await trx.raw("ALTER TABLE permissions AUTO_INCREMENT = 1"); // Reset AUTO_INCREMENT for 'permissions' table

        // Insert new permissions
        await trx("permissions").insert([
            {
                uuid: uuidv4(),
                name: "manage_users",
                description: "Permission to create, update, and delete users",
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            },
            {
                uuid: uuidv4(),
                name: "manage_roles",
                description: "Permission to create, update, and delete roles",
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            },
            {
                uuid: uuidv4(),
                name: "manage_permissions",
                description: "Permission to create, update, and delete permissions",
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            }
        ]);

        // Fetch the inserted permissions to get their ids
        const permissions = await trx("permissions")
            .select("id", "name")
            .whereIn("name", ["manage_users", "manage_roles", "manage_permissions"]);

        // Step 3: Delete existing entries from 'role_permissions' (if needed) and reset AUTO_INCREMENT
        await trx("role_permissions").del(); // Delete existing entries in 'role_permissions' table
        await trx.raw("ALTER TABLE role_permissions AUTO_INCREMENT = 1"); // Reset AUTO_INCREMENT for 'role_permissions' table

        // Insert role_permissions data
        const rolePermissionsData = [];

        // Add SuperAdmin permissions: all three permissions
        permissions.forEach(permission => {
            rolePermissionsData.push({
                role_id: superAdminRole.id, // Accessing directly
                permission_id: permission.id,
            });
        });

        // Add Admin permissions: only manage_users and manage_roles
        permissions
            .filter(permission => permission.name !== "manage_permissions")
            .forEach(permission => {
                rolePermissionsData.push({
                    role_id: adminRole.id, // Accessing directly
                    permission_id: permission.id,
                });
            });

        // Insert into role_permissions table
        await trx("role_permissions").insert(rolePermissionsData);

        // Verify data insertion
        await trx("role_permissions").select("*");
    });
}
