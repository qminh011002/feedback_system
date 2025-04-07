# 🚀 Project Setup Guide

Welcome! Follow the instructions below to set up and run the project locally.

---

## 📄 Step 1: Create `.env` File

Before installing dependencies or starting the development server, create a `.env` file in the root directory with the following content:

```env
SERVER_PORT=5001

DB_USERNAME=postgres
DB_PASSWORD=UurvQFxhvdTGrCDZmscvUyPZOdQMSRkE
DB_HOST=mainline.proxy.rlwy.net
DB_PORT=55786
DB=postgres
```

---

## 📦 Step 2: Install Dependencies

Use the following command to install all necessary dependencies:

```bash
npm install
```

---

## ▶️ Step 3: Start the Development Server

After installing the dependencies, start the development server:

```bash
npm run dev
```

Your app should now be running at `http://localhost:5001` (or the port you set in `.env`).

---

## 🧾 Accounts For Test

| Email             | Password   |
| ----------------- | ---------- |
| test1@example.com | test@12345 |
| test2@example.com | test@12345 |
| test3@example.com | test@12345 |
| test4@example.com | test@12345 |

> ⚠️ Passwords should always be stored in a **hashed** format.

# README – Database Schema Overview

## Overview

This database schema is designed to manage users, feedback, categories, and comments. It supports feedback categorization, commenting, status tracking, and anonymous interactions.

---

## Table: users

Stores user information.

- id: UUID, primary key, auto-generated
- username: VARCHAR(50), unique, not null
- password: VARCHAR(255), not null
- email: VARCHAR(100), unique, not null
- role: VARCHAR(20), default 'user'
- created_at: TIMESTAMP, default now()
- updated_at: TIMESTAMP, default now()
- imge_url: TEXT, default profile image URL

---

## Table: categories

Stores feedback categories.

- id: UUID, primary key, auto-generated
- name: VARCHAR(100), not null
- description: TEXT
- created_at: TIMESTAMP, default now()
- updated_at: TIMESTAMP, default now()

---

## Table: feedbacks

Stores user feedback entries.

- id: UUID, primary key, auto-generated
- title: VARCHAR(255), not null
- content: TEXT, not null
- user_id: UUID, foreign key to users(id)
- author_name: VARCHAR(100), not null
- category_id: UUID, foreign key to categories(id)
- status: VARCHAR(20), default 'open'
- is_comment_disabled: BOOLEAN, default false
- is_deleted: BOOLEAN, default false
- created_at: TIMESTAMP, default now()
- updated_at: TIMESTAMP, default now()
- rating: INTEGER, not null
- is_anonymous: BOOLEAN

Includes trigger: `trigger_update_comment_disabled` to automatically update comment availability based on status changes.

---

## Table: comments

Stores comments on feedback.

- id: UUID, primary key, auto-generated
- feedback_id: UUID, foreign key to feedbacks(id)
- user_id: UUID, foreign key to users(id)
- content: TEXT, not null
- is_deleted: BOOLEAN, default false
- author_name: VARCHAR(100), not null
- created_at: TIMESTAMP, default now()
- updated_at: TIMESTAMP, default now()
- is_anonymous: BOOLEAN

---

## Trigger: trigger_update_comment_disabled

- Executes before updating a row in `feedbacks`
- Checks if the `status` field changes
- Calls function `update_comment_disabled_on_status_change()` to toggle the `is_comment_disabled` field

## ✅ You're All Set!

Now you're ready to develop and test your app locally. If you encounter any issues, double-check your `.env` file and ensure all required packages are installed.

Happy coding! 💻
