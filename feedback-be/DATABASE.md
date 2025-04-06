# Feedback Platform Database Schema

This document outlines the database schema for a feedback platform. The system includes core entities such as Users, Feedbacks, Comments, Votes, Hashtags, and Categories. It also implements soft and hard delete strategies to maintain data integrity and performance.

---

## 📦 Tables Overview

### 🧑 USERS

Stores user account information.

| Column     | Type         | Description                   |
| ---------- | ------------ | ----------------------------- |
| ID         | UUID         | Primary key, auto-generated   |
| USERNAME   | VARCHAR(50)  | Unique username               |
| PASSWORD   | VARCHAR(255) | Password                      |
| EMAIL      | VARCHAR(100) | Unique email                  |
| IMAGE_URL  | TEXT         | User image                    |
| ROLE       | VARCHAR(20)  | User role (`user` by default) |
| CREATED_AT | TIMESTAMP    | Record creation time          |
| UPDATED_AT | TIMESTAMP    | Record update time            |

---

### 🗂️ CATEGORIES

Represents different feedback categories.

| Column      | Type         | Description                 |
| ----------- | ------------ | --------------------------- |
| ID          | UUID         | Primary key, auto-generated |
| NAME        | VARCHAR(100) | Category name               |
| DESCRIPTION | TEXT         | Optional description        |
| CREATED_AT  | TIMESTAMP    | Created time                |
| UPDATED_AT  | TIMESTAMP    | Last update time            |

---

### 💬 FEEDBACKS

Main entity where users submit feedback.

| Column              | Type         | Description               |
| ------------------- | ------------ | ------------------------- |
| ID                  | UUID         | Primary key               |
| TITLE               | VARCHAR(255) | Feedback title            |
| CONTENT             | TEXT         | Feedback content          |
| USER_ID             | UUID         | FK to `users`             |
| AUTHOR_NAME         | VARCHAR(100) | Cached name of the author |
| CATEGORY_ID         | UUID         | FK to `categories`        |
| STATUS              | VARCHAR(20)  | Feedback status           |
| IS_COMMENT_DISABLED | BOOLEAN      | If comments are disabled  |
| IS_DELETED          | BOOLEAN      | Soft delete flag          |
| CREATED_AT          | TIMESTAMP    | Creation time             |
| UPDATED_AT          | TIMESTAMP    | Update time               |

---

### 💭 COMMENTS

User comments on feedback.

| Column      | Type         | Description               |
| ----------- | ------------ | ------------------------- |
| ID          | UUID         | Primary key               |
| FEEDBACK_ID | UUID         | FK to `feedbacks`         |
| USER_ID     | UUID         | FK to `users`             |
| CONTENT     | TEXT         | Comment text              |
| IS_EDITED   | BOOLEAN      | If the comment was edited |
| IS_DELETED  | BOOLEAN      | Soft delete flag          |
| AUTHOR_NAME | VARCHAR(100) | Cached name of commenter  |
| CREATED_AT  | TIMESTAMP    | Creation time             |
| UPDATED_AT  | TIMESTAMP    | Last update time          |

---

### 🔖 HASHTAGS

List of hashtags used in feedbacks.

| Column     | Type        | Description         |
| ---------- | ----------- | ------------------- |
| ID         | UUID        | Primary key         |
| NAME       | VARCHAR(50) | Unique hashtag name |
| CREATED_AT | TIMESTAMP   | Created time        |
| UPDATED_AT | TIMESTAMP   | Updated time        |

---

### 🔗 FEEDBACK_HASHTAGS

Many-to-many relationship between feedbacks and hashtags.

| Column      | Type       | Description          |
| ----------- | ---------- | -------------------- |
| ID          | UUID       | Primary Key          |
| FEEDBACK_ID | UUID       | FK to `feedbacks`    |
| HASHTAG_ID  | UUID       | FK to `hashtags`     |
| BG_COLOR    | VARCHAR(7) |                      |
| COLOR       | VARCHAR(7) |                      |
| CREATED_AT  | TIMESTAMP  | Record creation time |

- 🔑 Composite Primary Key: `(FEEDBACK_ID, HASHTAG_ID)`

---

### 👍 VOTES

Tracks user votes on feedbacks.

| Column      | Type        | Description                          |
| ----------- | ----------- | ------------------------------------ |
| ID          | UUID        | Primary key                          |
| FEEDBACK_ID | UUID        | FK to `feedbacks`                    |
| USER_ID     | UUID        | FK to `users`                        |
| VOTE_TYPE   | VARCHAR(10) | Must be `'up_vote'` or `'down_vote'` |
| CREATED_AT  | TIMESTAMP   | Creation time                        |
| UPDATED_AT  | TIMESTAMP   | Update time                          |

- ✅ Unique Vote Constraint: `(FEEDBACK_ID, USER_ID)`

---

## 📌 Indexes

**Feedbacks:**

- `idx_feedbacks_user_id`
- `idx_feedbacks_category_id`
- `idx_feedbacks_status`

**Comments:**

- `idx_comments_feedback_id`

**Votes:**

- `idx_votes_feedback_id`

**Hashtags:**

- `idx_hashtags_name`

**Feedback_Hashtags:**

- `idx_feedback_hashtags_feedback_id`
- `idx_feedback_hashtags_hashtag_id`

---

## 🗑️ Deletion Strategy

| Table               | Deletion Type | Description                               | Reason                              |
| ------------------- | ------------- | ----------------------------------------- | ----------------------------------- |
| `users`             | Soft Delete   | Deactivate or archive user accounts       | Compliance and data preservation    |
| `categories`        | Soft Delete   | Deactivate unused categories              | Prevent reference issues            |
| `feedbacks`         | Soft Delete   | Deactivate user feedback                  | Preserve comments, votes, history   |
| `comments`          | Soft Delete   | Hide comment without deleting             | Moderation and audit trail          |
| `votes`             | Hard Delete   | Remove votes                              | Temporary data, saves space         |
| `hashtags`          | Soft Delete   | Hide unused hashtags                      | Historical data link preservation   |
| `feedback_hashtags` | Hard Delete   | Remove association between feedbacks/tags | Non-essential, lightweight relation |

---

## 🧠 Notes

- `GEN_RANDOM_UUID()` is used for automatic UUID generation.
- Timestamps use `NOW()` for default values.
- All time columns assume UTC timezone.
- Soft delete is managed via boolean flags (`IS_DELETED`) or business logic.

---
