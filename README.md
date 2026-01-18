# <img src="frontend/src/assets/logo.png" alt="ChoreCoins Logo" width="30" height="30" > ChoreCoins


**ChoreCoins** is a family chore management application that helps parents and children organize, track, and reward household chores.
The project is built as a full-stack app with a **React frontend**, **Spring Boot backend**, and **Supabase** for database and storage.
It includes live form validation, role-based permissions, image uploads, weekly stats, and scheduled backend tasks.

## ✨ Features
  
### Auth
- Register with live validation
- Choose role: **Parent** or **Child**
- Secure login with **JWT tokens**
- Logout with **JWT blacklisting**

### Edit User
- Edit user profile with live validation
- Delete account

### Dashboard
- Lists all your families
- Parents can create new families
- Click a family to open **Family Choreboard**

### Family Choreboard
##### *Family Overview*
- Shows current week and family name
- Lists members: **Parents first, then Children**
- Children see weekly stats: completed chores and earned coins
- History view: shows children’s weekly stats from previous weeks
- Add members to family via email search
- Parents can remove family members
- Parents can remove entire families (removes chores and child stats)
##### *Chore Management*
- Parents can create chores with title, description, coin value, due date, and assign to children
- Chores organized in three columns: **Not Started**, **Done**, **Approved**
- Not Started chores auto-cleared if overdue
- Sort chores by child or view all
##### *Chore Submission*
- Children submit assigned chores with uploaded images (JPEG, PNG, WebP) or/and comments
- Images resized in frontend and stored securely in **Supabase private storage**
- Parents can view, approve, or reject with comments
- Approved chores update child’s completed chores and coins
- Weekly reset of child stats (history preserved)

### Security
- Passwords hashed before storing
- Comments hashed in database
- Role-based access for images and actions

### Accessibility
- Proper semantic HTML elements used throughout the app
- ARIA attributes added for improved screen reader support
- All form fields and buttons properly labeled
- Full keyboard navigation supported

## 📁 Project Structure
  
### Backend (Spring Boot)
- `config`: Application configuration, including JWT filter, JWT utility, and security configuration
- `controller`: REST endpoints  
- `dto`: Data transfer objects  
- `entity`: JPA entities  
- `exception`: Global exceptions  
- `helper`: Helper classes specifically for supporting service classes
- `mapper`: Entity ↔ DTO mapping  
- `repository`: JPA repositories  
- `scheduler`: Scheduled tasks (weekly reset, chore cleanup)  
- `security`: Contains encrypter/decrypter and role-based access helpers
- `service`: Core business logic  

### Frontend (React)
- `app`: Main app setup  
- `assets`: Images and static assets  
- `css`: Global styles  
- `features`: Components and hooks for each page  
  - `auth`: Register & Login  
  - `dashboard`: Family dashboard  
  - `edituser`: Edit user profile  
  - `familychoreboard`: Choreboard page  
  - `landing`: Landing page  
- `shared`: Shared components, hooks, routes, utils, context 

## 🛠 Built With
  
### Frontend
- React ^19.2.0  
- React Router Dom ^7.9.6  
- Axios ^1.13.2  
- Vite ^7.2.4  
- React Modal ^3.16.3  

### Backend
- Java 21  
- Spring Boot 3.5.7  
- Spring Data JPA  
- Spring Security  
- JJWT 0.11.5  
- PostgreSQL 42.6.0  

### Database & Storage
- Supabase (PostgreSQL + Storage)  

### Other Tools
- Visual Studio Code (Frontend)  
- IntelliJ IDEA (Backend)  

## 🎯 Learning Goals
  
- Build a full-stack application from scratch with integrated frontend and backend  
- Handle JWT authentication and token blacklisting  
- Work with Supabase database and private storage  
- Upload and process images securely in the frontend  
- Implement role-based access and hash sensitive data  
- Use scheduled backend tasks for weekly resets and chore cleanup  
- Deepen Spring Boot and React skills

## 📌 Other
  
- All images used in the app's UI were generated entirely by ChatGPT, except for the background image, which is sourced from Freepik.
- This project was developed as my exam project, completed within a timeframe of total 90 hours.

## 📸 Screenshots
#### *Not logged in*
<img src="https://github.com/user-attachments/assets/7f1eeb96-2b8c-4108-b214-f12b11115c3a" height="280" alt="Landing page">
<img src="https://github.com/user-attachments/assets/54b7f767-5cc0-4efc-be1a-c322cf0a12bc" height="280" alt="Register page">
<img src="https://github.com/user-attachments/assets/68a1abc0-31ca-4295-b70c-212be915f2fc" height="280" alt="Login page">

#### *Logged in*
<img src="https://github.com/user-attachments/assets/7351be05-a952-4516-83ce-78f7041d7b68" height="280" alt="Dashboard page">
<img src="https://github.com/user-attachments/assets/0c08e763-5fdb-4b6b-9e42-25d272e423c8" height="280" alt="Edit User page">
<img src="https://github.com/user-attachments/assets/40d10e73-c09a-4e18-883f-11ddba067237" height="280" alt="Choreboard page (Family Part)">
<img src="https://github.com/user-attachments/assets/7cada5cb-6b49-4073-9217-c1f61cbb80be" height="280" alt="Choreboard page (Chore Part)">
<img src="https://github.com/user-attachments/assets/7f0ff420-6c79-492b-8210-fd2f75ed7db3" height="280" alt="Choreboard page (Submit View)">
<img src="https://github.com/user-attachments/assets/6d4607ab-8e9b-45cc-a18f-0da455a9b357" height="280" alt="Choreboard page (Rejected History View)">
<img src="https://github.com/user-attachments/assets/5f4c171a-b7cd-4a68-b5b3-58fdb909b16b" height="280" alt="Choreboard page (Approved History View)">

## 🚀 Live Project
  
This project uses environment variables for the database, storage, JWT, chor_encrypt, etc.
Cloning this repository will not allow you to run it locally, as you would need to set up your own database, storage, and secrets.

The project is live at: https://chorecoins.onrender.com - feel free to play around and explore the app!
