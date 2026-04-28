from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE ----------------
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    );

    CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        transport_km REAL,
        electricity_kwh REAL,
        diet_type TEXT,
        shopping_spend REAL
    );

    CREATE TABLE IF NOT EXISTS footprints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total_co2 REAL,
        transport_co2 REAL,
        electricity_co2 REAL,
        diet_co2 REAL,
        shopping_co2 REAL
    );
    """)

    conn.commit()
    conn.close()

# ---------------- CALCULATIONS ----------------
def calculate(data):
    transport = data["transport_km"] * 0.12
    electricity = data["electricity_kwh"] * 0.7

    diet_map = {
        "veg": 1.5,
        "non-veg": 3.0,
        "mixed": 2.0
    }

    diet = diet_map.get(data["diet_type"], 2.0)
    shopping = data["shopping_spend"] * 0.002

    total = transport + electricity + diet + shopping

    return transport, electricity, diet, shopping, total

# ---------------- SMART FEATURES ----------------

def get_score(total):
    if total < 10:
        return "🌿 Eco Hero (90+)"
    elif total < 20:
        return "👍 Good (70-90)"
    else:
        return "⚠️ High Emissions (<50)"

def get_suggestions(data):
    suggestions = []

    if data["transport_km"] > 15:
        suggestions.append("🚗 Reduce travel by 5km/day to cut emissions")

    if data["electricity_kwh"] > 10:
        suggestions.append("⚡ Switch to LED & reduce electricity usage")

    if data["diet_type"] == "non-veg":
        suggestions.append("🥦 Try veg meals 2–3 times a week")

    if data["shopping_spend"] > 1000:
        suggestions.append("🛍️ Reduce unnecessary shopping")

    if not suggestions:
        suggestions.append("✅ You're doing great! Keep it up")

    return suggestions

def predict(total):
    monthly = total * 30
    return f"📊 At this rate, you'll emit ~{round(monthly,2)} kg CO2/month"

def what_if(data):
    reduced_transport = data["transport_km"] * 0.5
    saved = (data["transport_km"] - reduced_transport) * 0.12

    return {
        "new_transport_km": reduced_transport,
        "co2_saved": round(saved, 2)
    }

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return {"message": "Carbon Tracker API running 🚀"}

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (data["username"], data["password"])
        )
        conn.commit()
        return {"message": "User created"}
    except:
        return {"error": "User already exists"}
    finally:
        conn.close()

@app.route("/calculate", methods=["POST"])
def calculate_route():
    data = request.json

    transport, electricity, diet, shopping, total = calculate(data)

    score = get_score(total)
    suggestions = get_suggestions(data)
    prediction = predict(total)
    simulation = what_if(data)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO footprints (user_id, total_co2, transport_co2, electricity_co2, diet_co2, shopping_co2)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["user_id"],
        total,
        transport,
        electricity,
        diet,
        shopping
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "total": total,
        "score": score,
        "suggestions": suggestions,
        "prediction": prediction,
        "what_if": simulation,
        "breakdown": {
            "transport": transport,
            "electricity": electricity,
            "diet": diet,
            "shopping": shopping
        }
    })

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    user = cursor.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    ).fetchone()

    conn.close()

    if user:
        return jsonify({
            "message": "Login successful",
            "user_id": user["id"]
        })
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# ---------------- RUN ----------------
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
