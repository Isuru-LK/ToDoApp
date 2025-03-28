import sys
sys.path.append('/app')
print("sys.path:", sys.path)
import pytest
from app import app, get_db_connection
import psycopg2

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def db_setup():
    conn = get_db_connection()
    with conn.cursor() as cur:
        cur.execute("DROP TABLE IF EXISTS task")
        cur.execute("""
            CREATE TABLE task (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    yield conn
    conn.close()

def test_get_tasks_empty(client, db_setup):
    response = client.get('/api/tasks')
    assert response.status_code == 200
    assert response.json == []

def test_create_task(client, db_setup):
    response = client.post(
        '/api/tasks',
        json={"title": "Test Task", "description": "Test Desc"}
    )
    assert response.status_code == 201
    assert "id" in response.json

    # Verify it appears in GET
    get_response = client.get('/api/tasks')
    assert len(get_response.json) == 1
    assert get_response.json[0]["title"] == "Test Task"
    assert get_response.json[0]["description"] == "Test Desc"

def test_complete_task(client, db_setup):
    # Create a task
    post_response = client.post(
        '/api/tasks',
        json={"title": "Test Task", "description": "Test Desc"}
    )
    task_id = post_response.json["id"]

    # Complete it
    response = client.put(f'/api/tasks/{task_id}')
    assert response.status_code == 204

    # Verify it’s gone from GET
    get_response = client.get('/api/tasks')
    assert len(get_response.json) == 0