import { Injectable, OnModuleInit } from '@nestjs/common';
import MeiliSearch, { DocumentOptions, Settings } from 'meilisearch';

@Injectable()
export class MeiliService extends MeiliSearch implements OnModuleInit {
	constructor() {
		super({
			host: process.env.MEILI_ADDR || 'http://meilisearch:7700',
			apiKey: process.env.MEILI_MASTER_KEY,
		});
	}

	async definedIndex(uid: string, opts: Settings) {
		let task = await this.createIndex(uid, { primaryKey: 'id' });
		await this.waitForTask(task.taskUid);
		task = await this.index(uid).updateSettings(opts);
		await this.waitForTask(task.taskUid);
	}

	async onModuleInit() {
		await this.definedIndex('songs', {
			searchableAttributes: ['name', 'artist'],
			filterableAttributes: ['artistId', 'genreId'],
		});
		await this.definedIndex('artists', {
			searchableAttributes: ['name'],
		});
	}
}
