FocusFlow — Task & Productivity Management App
FocusFlow is a modern, interactive productivity dashboard built using Flask, JavaScript, and a fully synced task management system.
It includes a Dashboard, Task Manager, and Interactive Calendar — all connected and synced through a backend JSON API.

-------------------------
Features

1. Dashboard Overview
Displays all tasks with progress bars, priorities, tags, subtasks, and status badges
Live search functionality
Status pills (Coming Next, In Progress, Completed)
Clicking a pill filters tasks on the Tasks page
Project cards showing progress and team members


2. Task Manager (tasks.html)
Add new tasks using a modal form
Edit existing tasks (fully synced with backend)
Delete tasks
Filtering tabs: All, Coming Next, In Progress, Completed
Auto-progress updates based on status
All tasks saved in tasks.json
Editing reflects immediately in Dashboard + Calendar

3. Interactive Calendar (projects.html)
Fully dynamic monthly calendar
Tasks appear on their assigned date
Add tasks by clicking “+” on any day
Edit or delete tasks by clicking on them
Drag & drop tasks to different days
Moving a task automatically updates its date in tasks.json
Today is always editable, even with timezone differences

4. Authentication
Sign Up and Login system
Users saved in users.json
Logged-in session management
Delete account functionality


5. Theme & UI
Light/Dark mode toggle synced across pages
Responsive, modern UI components
Clean dashboard layout
Avatar system for team members


Project Architecture
FocusFlow/
│
├── app.py                 # Flask backend (routes, API, authentication)
├── tasks.json             # Task storage
├── users.json             # User account storage
│
├── templates/
│   ├── index.html         # Dashboard
│   ├── tasks.html         # Tasks page
│   ├── projects.html      # Calendar page
│   ├── settings.html      # Settings
│   ├── auth.html          # Login + Signup page
│   └── other pages...
│
├── static/
│   ├── css/               # Stylesheets
│   ├── js/
│   │   ├── dashboard.js   # Dashboard logic (reads backend tasks)
│   │   ├── tasks.js       # Task manager (edit/add/delete)
│   │   └── projects.js    # Calendar logic (drag, drop, sync)
│   └── images/
│
└── README.md

How Everything Syncs Together

FocusFlow uses a single source of truth:
→ tasks.json
All pages interact with it through Flask routes:
GET /get_tasks
Returns all tasks
POST /save_tasks
Saves modified tasks back to JSON
This ensures:
Dashboard tasks are always up-to-date
Tasks page reflects calendar changes
Calendar drag-and-drop updates task dates globally
Edits in task modal update all pages


Technologies Used
Frontend
HTML, CSS
Vanilla JavaScript
Boxicons
Pravatar (avatars)
LocalStorage (theme & UI preferences)
Backend
Python Flask
Jinja Templates
JSON as lightweight storage


Key Functionality

✔ Global Syncing
All tasks across Dashboard, Tasks page, and Calendar stay perfectly aligned.
✔ Automatic Progress
Changing a task’s status updates its progress value:
Status	Progress
coming-next	0%
in-progress	50%
completed	100%
✔ Calendar Drag + Drop
Move tasks across dates with smooth UI updates and backend sync.


How to Run the Project

1. Install requirements (if needed)
pip install flask
2. Run the app
python app.py
3. Open in browser
http://127.0.0.1:5000/


Future Improvements i would like to add 
Convert JSON to real database (SQLite/PostgreSQL)
Add notifications
Add recurring tasks
Add user profiles and avatars
Add subtasks UI
Add search on calendar page


Author
Fatma Amin
(With debugging support, design improvements, and architecture guidance.)
Project built fully step-by-step with complete understanding of the codebase.