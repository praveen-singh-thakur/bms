import { Model } from './base.model';
import { IMedia } from './interfaces/media.interface';

class MediaModel extends Model<IMedia> {
	private static instance: MediaModel;

	constructor() {
		super('media');
	}

	static get(): MediaModel {
		if (!MediaModel.instance) {
			MediaModel.instance = new MediaModel();
		}
		return MediaModel.instance;
	}

}

const Media = MediaModel.get();

export { Media };

