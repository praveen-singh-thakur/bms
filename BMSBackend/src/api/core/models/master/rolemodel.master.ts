import { IRole } from "@dbinterfaces";
import { Model } from "@models/base.model";
import { Knex } from 'knex';

export class RoleModel extends Model<IRole> {
    private db: Knex;

    constructor(db: Knex) {
        super(db, "roles");
        this.db = db;
    }

} 