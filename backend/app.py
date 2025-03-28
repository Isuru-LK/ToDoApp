from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv('DB_NAME', 'todo'),
        user=os.getenv('DB_USER', 'user'),
        password=os.getenv('DB_PASSWORD', 'password'),
        host=os.getenv('DB_HOST', 'db')
    )

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO task (title, description) VALUES (%s, %s) RETURNING id",
                (title, description)
            )
            task_id = cur.fetchone()[0]
            conn.commit()
    return jsonify({"id": task_id}), 201

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, title, description FROM task WHERE is_completed = FALSE ORDER BY created_at DESC LIMIT 5"
            )
            tasks = cur.fetchall()
    return jsonify(tasks)

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def complete_task(task_id):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE task SET is_completed = TRUE WHERE id = %s", (task_id,)
            )
            conn.commit()
    return '', 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)