from flask import Flask, render_template, request, redirect, session, jsonify
import json
import os

app = Flask(__name__)
app.secret_key = "focusflow_secret_key"

users = {}

# Path to tasks file
TASKS_FILE = "tasks.json"

def load_json_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE, "r") as f:
        return json.load(f)

def save_json_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)


@app.route("/")
def home():
    return redirect("/login")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        if email in users and users[email]["password"] == password:
            session["user"] = users[email]["name"]
            return redirect("/dashboard")
        
        return render_template("auth.html", error="Invalid credentials")

    return render_template("auth.html")


@app.route("/signup", methods=["POST"])
def signup():
    name = request.form["name"]
    email = request.form["email"]
    password = request.form["password"]

    if email in users:
        return render_template("auth.html", error="Email already exists", show_signup=True)

    users[email] = {"name": name, "password": password}

    return render_template("auth.html", success="Account created! Please login.")



@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")
    return render_template("index.html", user=session["user"])


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


# 🔥 Return tasks as proper JSON
@app.route("/get_tasks")
def get_tasks():
    import json
    from flask import jsonify

    with open("tasks.json", "r") as f:
        tasks = json.load(f)

    return jsonify(tasks)


# 🔥 Save tasks to JSON
@app.route("/save_tasks", methods=["POST"])
def save_tasks():
    tasks = request.json
    save_json_tasks(tasks)
    return jsonify({"success": True})


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

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True)
