from django.contrib import admin
from .models import Template, Review

admin.site.register(Review)

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "description", "file"]
    search_fields = ["name", "description"]
