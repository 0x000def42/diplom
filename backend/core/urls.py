from django.urls import path
from .views import template_list, template_download, create_review

urlpatterns = [
    path("templates/", template_list, name="template_list"),
    path("templates/<int:id>/download/", template_download, name="template_download"),
    path("reviews/", create_review, name="create_review"),
]