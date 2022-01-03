export default class Details {
	id: string;
	source: string;
	title: string;
	lengthInSeconds: string;
	lengthInText: string;
	publishedTime: string;
	href: string;
	channel: {
		id: string;
		title: string;
		url: string;
		avatar: {
			large: string;
			medium: string;
			thumb: string;
		};
	};
	description: string;
	thumbnails: Array<{
		url: string;
		height: string;
		width: string;
		desc: string;
	}>;
	stats: {
		viewCount: 0;
		likeCount: 0;
		shareCount: 0;
		commentCount: 0;
	};
}
  