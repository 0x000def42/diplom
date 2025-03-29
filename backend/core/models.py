import base64
import time
import requests
import zipfile
import io
from django.db import models
from django.core.files.base import ContentFile

FR_CLOUD_API_KEY = "sia6hnbme7u56xr1udp3i5pp5cs1qd6xwgdgon1aaefwsdbd8pco"
FR_CLOUD_BASE_URL = "https://fastreport.cloud"
FR_CLOUD_FOLDER_ID = "613e0fe3da2af446c694465b"
FR_CLOUD_UPLOAD_URL = f"{FR_CLOUD_BASE_URL}/api/rp/v1/Templates/Folder/{FR_CLOUD_FOLDER_ID}/File"

def fr_cloud_request(method, url, headers=None, json=None, retries=5, delay=1):
    """Общий метод для логирования всех запросов к FastReport Cloud"""
    headers = headers or {}
    headers["Authorization"] = f"Basic {base64.b64encode(f'apikey:{FR_CLOUD_API_KEY}'.encode()).decode()}"

    for attempt in range(1, retries + 1):
        response = requests.request(method, url, headers=headers, json=json)

        if response.status_code == 200:
            return response.json()
        
        time.sleep(delay)
    
    response.raise_for_status()

class Review(models.Model):
    email = models.EmailField()
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ExternalUser(models.Model):
    external_id = models.CharField(max_length=255, unique=True)
    provider = models.CharField(max_length=50)
    email = models.EmailField()
    name = models.CharField(max_length=255)

    likes = models.ManyToManyField('Template', related_name='liked_by', blank=True)

    class Meta:
        unique_together = ('external_id', 'provider')

class Template(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    preview_file = models.FileField(upload_to="previews/", null=True, blank=True)
    file = models.FileField(upload_to="templates/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(ExternalUser, on_delete=models.SET_NULL, related_name='templates', null=True, blank=True)


    def upload_to_fr_cloud(self):
        """Загружает файл в FastReport Cloud и возвращает remote_id"""
        with self.file.open("rb") as f:
            file_content = f.read()

        data = {
            "name": self.name,
            "content": base64.b64encode(file_content).decode()
        }

        response = fr_cloud_request("POST", FR_CLOUD_UPLOAD_URL, json=data)
        remote_id = response.get("id")
        return remote_id

    def export_to_image(self, remote_id):
        """Экспортирует шаблон в картинку и возвращает remote_export_id"""
        url = f"{FR_CLOUD_BASE_URL}/api/rp/v1/Templates/File/{remote_id}/Export"
        data = {"format": "Image", "exportParameters": {"PageRange": "All"}}

        response = fr_cloud_request("POST", url, json=data)
        export_id = response.get("id")
        return export_id

    def wait_for_export(self, export_id):
        """Ожидает завершения экспорта"""
        url = f"{FR_CLOUD_BASE_URL}/api/rp/v1/Exports/File/{export_id}"
        
        for attempt in range(1, 10):
            response = fr_cloud_request("GET", url)
            status = response.get("status")

            if status == "Success":
                return export_id
            
            time.sleep(1)
        
        raise Exception(f"[Template {self.id}] Экспорт не был завершён вовремя")

    def download_export(self, export_id):
        """Скачивает экспортированный файл (ZIP) и извлекает первое изображение"""
        url = f"{FR_CLOUD_BASE_URL}/download/e/{export_id}"
        headers = {
            "Authorization": f"Basic {base64.b64encode(f'apikey:{FR_CLOUD_API_KEY}'.encode()).decode()}"
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            content = response.content

            with zipfile.ZipFile(io.BytesIO(content), "r") as zip_file:
                for file_name in zip_file.namelist():
                    if file_name.lower().endswith((".jpg", ".jpeg", ".png")):
                        with zip_file.open(file_name) as image_file:
                            image_content = image_file.read()
                            self.preview_file.save(file_name, ContentFile(image_content))
                            self.save()
                            return

            raise Exception(f"[Template {self.id}] ZIP-архив не содержит изображений")

        else:
            raise Exception(f"[Template {self.id}] Ошибка скачивания экспортированного файла")

    def process_template(self):
        """Полный цикл обработки шаблона"""

        remote_id = self.upload_to_fr_cloud()
        export_id = self.export_to_image(remote_id)
        export_id = self.wait_for_export(export_id)
        self.download_export(export_id)

class TemplateVersion(models.Model):
    file = models.FileField(upload_to="templates/")
    preview_file = models.FileField(upload_to="previews/", null=True, blank=True)
    template = models.ForeignKey(Template, on_delete=models.SET_NULL, related_name='versions', null=True, blank=True)