FROM python:3.12-slim

WORKDIR /app

# Evita que Python genere archivos .pyc y fuerza los logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala dependencias y Gunicorn (servidor de producción)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copia el resto del código del backend
COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Levanta Django con Gunicorn apuntando a tu carpeta config
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]