from flask import Flask, render_template, request, redirect, session

app = Flask(__name__)
app.secret_key = "focusflow_secret_key"

# TEMP user storage (replace later with real DB or API)
users = {}

@app.route("/")
def home():
    return redirect("/login")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        # Check if user exists
        if email in users and users[email]["password"] == password:
            session["user"] = users[email]["name"]
            return redirect("/dashboard")
        else:
            return render_template("auth.html", error="Invalid email or password")

    return render_template("auth.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        # Check existing email
        if email in users:
            return render_template("auth.html", error="Email already exists")

        # Save user in memory
        users[email] = {"name": name, "password": password}
        return redirect("/signup")

    # GET -> show signup/login page (auth.html)
    return render_template("auth.html")

@app.route("/delete-account", methods=["POST", "GET"])
def delete_account():
    # If you want to actually delete the user from `users`, do it here.
    # Example (if you stored email in session): 
    # email = session.get("email")
    # if email in users: del users[email]

    # For now just clear session (log user out)
    session.clear()

    # Redirect to the signup page (ensure /signup supports GET as in Option A)
    return redirect("/signup")



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
