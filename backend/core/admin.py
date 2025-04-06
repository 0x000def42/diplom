from django.contrib import admin
from django.utils.html import format_html
from django.urls import path, reverse
from django.shortcuts import redirect
from django.contrib import messages
from .models import Template, Review

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "description", "preview_image", "process_button"]
    search_fields = ["name", "description"]
    readonly_fields = ["preview_file"]  # Запрещаем редактирование preview_file в админке

    def preview_image(self, obj):
        """Показывает предпросмотр файла в админке"""
        if obj.preview_file:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.preview_file.url)
        return "Нет превью"

    preview_image.short_description = "Превью"

    def process_button(self, obj):
        """Кнопка для обработки шаблона (исправленный URL)"""
        url = reverse("admin:process_template", args=[obj.id])
        return format_html('<a class="button" href="{}">Обработать</a>', url)

    process_button.short_description = "Обработать шаблон"
    process_button.allow_tags = True

    def get_urls(self):
        """Исправляем маршруты и редиректим кривые URL"""
        urls = super().get_urls()
        custom_urls = [
            # Основной маршрут обработки
            path("template/<int:pk>/process/", self.process_template, name="process_template"),

            # Ловим кривые редиректы и возвращаем на страницу шаблона
            path("template/template/<int:pk>/process/", self.redirect_fixed_url),
            path("template/template/<int:pk>/", self.redirect_fixed_url),
        ]
        return custom_urls + urls

    def process_template(self, request, pk):
        """Вызывает обработку шаблона через кнопку в админке"""
        try:
            template = Template.objects.get(pk=pk)
            template.process_template()
            messages.success(request, "Шаблон успешно обработан!")
        except Template.DoesNotExist:
            messages.error(request, f"Шаблон с ID {pk} не найден!")
        except Exception as e:
            messages.error(request, f"Ошибка: {str(e)}")
        return redirect(f"/admin/core/template/{pk}/change/")  # После обработки ведём в карточку шаблона

    def redirect_fixed_url(self, request, pk):
        """Редиректит кривые URL обратно в шаблон"""
        return redirect(f"/admin/core/template/{pk}/change/")

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "title", "created_at"]
    search_fields = ["email", "title", "body"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False