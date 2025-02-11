from rest_framework import serializers
from .models import Template, Review

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ["id", "name", "preview_link"]

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "email", "title", "body"]
