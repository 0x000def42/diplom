from rest_framework import serializers
from .models import Template, Review

class TemplateListSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    preview_url = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = ["id", "name", "description", "file_url", "preview_url"]

    def get_file_url(self, obj):
        return f"{obj.file.url}" if obj.file else None

    def get_preview_url(self, obj):
        return f"{obj.preview_file.url}" if obj.preview_file else None
        
class TemplateSerializer(TemplateListSerializer):
    liked = serializers.SerializerMethodField()
    owns = serializers.SerializerMethodField()

    class Meta(TemplateListSerializer.Meta):
        fields = TemplateListSerializer.Meta.fields + ["liked", "owns"]

    def get_liked(self, obj):
        user = self.context.get("user")
        if not user:
            return False
        return obj.liked_by.filter(id=user.id).exists()
    
    def get_owns(self, obj):
        user = self.context.get("user")
        if not user:
            return False
        return obj.user_id == user.id

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["email", "title", "body"]
