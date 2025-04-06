interface IUser {
	id: string;
	user_name: string;
	email: string;
	role: string;
	imge_url: string;
}

interface ICategory {
	id: string;
	name: string;
	description: string;
}

interface IFeedback {
	id: string;
	title: string;
	content: string;
	rating: number;
	status: string;
	is_anonymous: boolean;
	created_at: string;
	author_name: string;
	category_name: string;
	vote_count: number;
	comment_count: number;
	user: {
		username: string;
		avatar: string;
	};
}

interface IComment {
	id: string;
	feedback_id: string;
	user_id: string;
	content: string;
	is_edited: boolean;
	is_deleted: boolean;
	author_name: string;
	created_at: Date;
	updated_at: Date;
}

interface IHashtag {
	id: string;
	name: string;
}

interface IVote {
	id: string;
	feedback_id: string;
	user_id: string;
	vote_type: 'up_vote' | 'down_vote';
}

interface IFeedbackHashtag {
	id: string;
	feedback_id: string;
	hashtag_id: string;
	bgcolor: string;
	color: string;
}

export type { ICategory, IComment, IFeedback, IFeedbackHashtag, IHashtag, IUser, IVote };
