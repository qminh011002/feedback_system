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

## ✅ You're All Set!

Now you're ready to develop and test your app locally. If you encounter any issues, double-check your `.env` file and ensure all required packages are installed.

Happy coding! 💻
