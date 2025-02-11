from django.db import models

class Template(models.Model):
    name = models.CharField(max_length=255)
    preview_link = models.TextField()
    file = models.FileField(upload_to="templates/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    email = models.EmailField()
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
