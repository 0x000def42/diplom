# 

# Cli utilities

Create superuser
```
python manage.py createsuperuser
```
user / admin

Start server
```
python manage.py runserver
```

Recreate db and migrations
```
rm -rf core/migrations/         
rm db.sqlite3
python manage.py makemigrations core
python manage.py migrate
```

Install dependencies:
```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```