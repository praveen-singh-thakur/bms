import { MimeType } from '@types';
import { IUser } from '@models/interfaces';

interface IMedia {
	id?: number | string;
	field_name?: string;
	file_name?: string;
	path?: string;
	mimetype?: MimeType;
	destination?: string;
	encoding?: string;
	original_name?: string;
	size?: number;
	owner?: number | string | IUser;
	owner_name?: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
}

export { IMedia };