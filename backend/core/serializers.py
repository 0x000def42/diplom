from rest_framework import serializers
from .models import Template, Review

class TemplateSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = ["id", "name", "description", "file_url"]

    def get_file_url(self, obj):
        return obj.file.url if obj.file else None

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "email", "title", "body"]
