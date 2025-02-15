from rest_framework import serializers
from .models import Template, Review

class TemplateSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = ["id", "name", "description", "file_url", "preview_url"]

    def get_file_url(self, obj):
        return f"http://localhost:8000{obj.file.url}" if obj.file else None

    def get_preview_url(self, obj):
        return f"http://localhost:8000{obj.preview_file.url}" if obj.preview_file else None

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["email", "title", "body"]
