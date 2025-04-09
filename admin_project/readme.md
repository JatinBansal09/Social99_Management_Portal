Steps to setup the env and the db:
-  Open a new terminal in your project directory.
- python -m venv social99
- .venv\Scripts\activate

- pip install asgiref chardet Django et_xmlfile mysqlclient numpy openpyxl pandas pillow python-dateutil pytz reportlab six sqlparse tzdata APScheduler camelot-py cffi charset-normalizer click colorama cryptography distro opencv-python-headless pdfminer pdfminer.six pycparser pycryptodome pypdf pypdfium2 tabula-py tabulate tzlocal XlsxWriter
- cd admin_project
- Use 'social99' database if that's already there in Mysql otherwise install it.
- If 'auth_user' table is already there then its awesome.
- Delete Site table in mysql
- Delete folder 'pycache' in 'site_panel/migrations' and delete files from migrations too besides 'init.py'
- run: python manage.py makemigrations
- run: python manage.py migrate
- python manage.py dbshell
- SET FOREIGN_KEY_CHECKS = 0;
- UPDATE auth_user SET last_name = 'all', is_staff = 0 WHERE username = 'admin';
- SET FOREIGN_KEY_CHECKS = 1;
- run: python manage.py runserver