interface User {
	id: string;
	username: string;
	email: string;
	role: string;
	created_at: Date;
	updated_at: Date;
	image_url: string;
}

interface Category {
	id: string;
	name: string;
	description?: string;
	created_at: Date;
	updated_at: Date;
}

interface Feedback {
	id: string;
	title: string;
	content: string;
	user_id: string;
	author_name: string;
	category_id: string;
	status: 'open' | 'in_progress' | 'closed';
	is_comment_disabled: boolean;
	is_deleted: boolean;
	created_at: Date;
	updated_at: Date;
	rating: number;
}

interface Comment {
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

interface Hashtag {
	id: string;
	name: string;
	created_at: Date;
	updated_at: Date;
}

interface Vote {
	id: string;
	feedback_id: string;
	user_id: string;
	vote_type: 'up_vote' | 'down_vote';
	created_at: Date;
	updated_at: Date;
}

interface FeedbackHashtag {
	id: string;
	feedback_id: string;
	hashtag_id: string;
	bgcolor: string;
	color: string;
}

export type { Category, Comment, Feedback, FeedbackHashtag, Hashtag, User, Vote };
