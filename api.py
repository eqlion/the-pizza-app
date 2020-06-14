from flask import Flask, jsonify, request, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from flask_cors import CORS
from datetime import datetime

import json

app = Flask(__name__, static_folder="./build", static_url_path="/")

app.secret_key = "some_very_secret_key_lmao"

app.config["MYSQL_HOST"] = "sql7.freemysqlhosting.net"
app.config["MYSQL_USER"] = "sql7347682"
app.config["MYSQL_PASSWORD"] = "N3M7SqAFxx"
app.config["MYSQL_DB"] = "sql7347682"
app.config['JWT_SECRET_KEY'] = 'some_very_secret_key_lmao'

mysql = MySQL(app)
jwt = JWTManager(app)

CORS(app)


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/pizzas")
def get_pizzas():
    return jsonify([{
        "id": "1",
        "name": "Pepperoni",
        "desc": "Pepperoni, mozzarella, tomato sauce",
        "cost": 20,
        "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/ba1a843b-188e-4a6c-851d-c32543547a46.jpg",
    },
        {
        "id": "2",
            "name": "Cheesy",
            "desc": "Mozzarella, parmesan, cheddar, blue cheese, cream sauce",
            "cost": 20,
            "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/baf084f4-fc94-443c-a646-fdeff9f301a6.jpg",
    },
        {
        "id": "3",
            "name": "Veggie",
            "desc":
                "Italian herbs, tomato sauce, goat cheese, champignon, red onion, mozzarella, olives, tomatoes",
            "cost": 17,
            "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/2fcaf96e-58b1-474f-b4f4-8e7d0a78929e.jpg",
    },
        {
        "id": "4",
            "name": "Hawaiian",
            "desc": "Chicken, tomato sauce, mozzarella, pineapples",
            "cost": 17,
            "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/3628bd26-38d2-4a95-8dcb-859a81de221c.jpg",
    },
        {
        "id": "5",
            "name": "Extra meat",
            "desc": "Chicken, pepperoni, tomato sauce, chorizo, mozzarella",
            "cost": 20,
            "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/3d806787-1496-4fc4-a3ec-c272a6ba3c8b.jpg",
    },
        {
        "id": "6",
        "name": "Ham and Cheese",
        "desc": "Ham, mozzarella, cream sauce",
        "cost": 12,
        "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/483b5bef-1b34-49dc-81c6-3d912468eee2.jpg",
    }, {
        "id": "7",
        "name": "Four seasons",
        "desc": "Mozzarella, ham, pepperoni, goat cheese, tomatoes, champignions, tomato sauce, italian herbs",
        "cost": 17,
        "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/61076ae4-4588-448b-a2d6-f310f327c0e5.jpg",
    }, {
        "id": "8",
        "name": "Margarita",
        "desc": "Mozzarella, tomatoes, italian herbs, tomato sauce",
        "cost": 17,
        "image":
                "https://cdn.dodostatic.net/static/Img/Products/Pizza/ru-RU/7343b7da-bbc6-4307-af2f-2029ba3f7126.jpg",
    }])


@app.route("/api/login", methods=["POST"])
def login():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    email = request.json["email"]
    password = request.json["password"]
    cursor.execute(
        'SELECT * FROM accounts WHERE email = %s AND password = %s', (email, password))

    account = cursor.fetchone()
    if account:
        access_token = create_access_token(identity={"email": email})
        return jsonify(result="Logged in", access_token=access_token, code=200, ok=True)
    else:
        return jsonify(result="Account not found", code=400, ok=False)


@app.route("/api/signup", methods=["POST"])
def register():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    email = request.json["email"]
    password = request.json["password"]
    cursor.execute(
        'INSERT INTO accounts (email, password) VALUES (%s, %s)', (email, password))
    mysql.connection.commit()
    access_token = create_access_token(identity={"email": email})
    return jsonify(result="Registered", access_token=access_token, code=200, ok=True)


@app.route("/api/order", methods=["POST"])
def order():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    pizzas = request.json["pizzas"]
    user = request.json["email"]
    address = request.json["address"]
    phone = request.json["phone"]
    datetime_ = datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    id_ = 1
    cursor.execute(
        'INSERT INTO orders (user, order_comp, datetime, phone, address) VALUES (%s, %s, %s, %s, %s)', (user, pizzas, datetime_, phone, address))
    mysql.connection.commit()
    cursor.execute('SELECT LAST_INSERT_ID()')
    id_ = cursor.fetchone()["LAST_INSERT_ID()"]
    return jsonify(result="Order placed", code=200, ok=True, id=id_)


@app.route("/api/history")
def history():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    email = request.args.get("email")
    # print(type(email))
    cursor.execute('SELECT * FROM orders WHERE user = %s', [email])
    h = cursor.fetchall()

    def f(i):
        return {"id": i["id"], "user": i["user"], "address": i["address"], "phone": i["phone"], "datetime": i["datetime"], "order_comp": json.loads(i["order_comp"].replace("'", '"'))}
    h = list(map(f, h))
    return jsonify(ok=True, history=h)
