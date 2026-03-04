# SOHI BAKERY WEB SYSTEM

A simple bakery management system with Admin and Customer roles.

---

# HOW TO RUN THE PROJECT

## 1️⃣ Setup the Database

1. Download the zip file  
2. Open MySQL Workbench  
3. Create a new database:

```sql
CREATE DATABASE sohi_bakery;
```

4. Import the provided SQL file into the `sohi_bakery` database.

5. Open `backend/src/config/db.js`

6. Change the MySQL username and password according to your MySQL Workbench credentials.

---

## 2️⃣ Run the Backend

Open your terminal and run:

```bash
cd backend
npm install
npm run dev
```

---

## 3️⃣ Run the Frontend

After the backend is running:

Open the HTML file inside the **frontend** folder in your browser.

---

# DEFAULT LOGIN ACCOUNTS

## Admin Account

- Email: natalie@gmail.com  
- Password: admin123  

---

## Customer Account

- Email: test@gmail.com  
- Password: 123456  
