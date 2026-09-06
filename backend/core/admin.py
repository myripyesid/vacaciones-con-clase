# core/admin.py
from django.contrib import admin
from .models import Plan, Cliente, Asesor, Lead, Venta

admin.site.register(Plan)
admin.site.register(Cliente)
admin.site.register(Asesor)
admin.site.register(Lead)
admin.site.register(Venta)