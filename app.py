from flask import Flask, render_template, request, redirect, session, jsonify
import json
import os

app = Flask(__name__)
app.secret_key = "focusflow_secret_key"

# -----------------------------
#   USER JSON STORAGE
# -----------------------------

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users_data):
    with open(USERS_FILE, "w") as f:
        json.dump(users_data, f, indent=2)

# Load users when app starts
users = load_users()

# -----------------------------
#   TASK JSON STORAGE
# -----------------------------

TASKS_FILE = "tasks.json"

def load_json_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE, "r") as f:
        return json.load(f)

def save_json_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)

# -----------------------------
#            ROUTES
# -----------------------------

@app.route("/")
def home():
    return redirect("/login")


# ---------- LOGIN ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        if email in users and users[email]["password"] == password:
            session["user"] = email
            return redirect("/dashboard")

        return render_template("auth.html", error="Invalid credentials")

    return render_template("auth.html")


# ---------- SIGNUP (AUTO LOGIN after signup) ----------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        if email in users:
            return render_template("auth.html", error="Email already exists", show_signup=True)

        # Save new user
        users[email] = {"name": name, "password": password}
        save_users(users)

        # Auto-login after signup 🔥
        session["user"] = email

        return redirect("/dashboard")

    return render_template("auth.html", show_signup=True)


# ---------- DELETE ACCOUNT ----------
@app.route("/delete_account", methods=["POST"])
def delete_account():
    if "user" not in session:
        return jsonify({"redirect": "/login"})

    email = session["user"]

    if email in users:
        users.pop(email)
        save_users(users)

    session.clear()

    return jsonify({"redirect": "/signup"})


# ---------- DASHBOARD ----------
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")

    return render_template("index.html", user=session["user"])


# ---------- PAGES ----------
@app.route("/projects")
def projects():
    if "user" not in session:
        return redirect("/login")
    return render_template("projects.html", user=session["user"])


@app.route("/tasks")
def tasks():
    if "user" not in session:
        return redirect("/login")
    return render_template("tasks.html", user=session["user"])


@app.route("/messages")
def messages():
    if "user" not in session:
        return redirect("/login")
    return render_template("messages.html", user=session["user"])


@app.route("/team")
def team():
    if "user" not in session:
        return redirect("/login")
    return render_template("team.html", user=session["user"])


@app.route("/settings")
def settings():
    if "user" not in session:
        return redirect("/login")
    return render_template("settings.html", user=session["user"])


# ---------- TASK API ----------
@app.route("/get_tasks")
def get_tasks():
    tasks = load_json_tasks()
    return jsonify(tasks)


@app.route("/save_tasks", methods=["POST"])
def save_tasks():
    tasks = request.json
    save_json_tasks(tasks)
    return jsonify({"success": True})


# ---------- LOGOUT ----------
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True)
