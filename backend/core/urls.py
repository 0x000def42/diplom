from django.urls import path
from . import views as v

urlpatterns = [
    path("templates", v.TemplatesView.as_view(), name="template_list"),
    path("templates/meta", v.template_list_meta),
    path("templates/<int:id>", v.template_get),
    path("templates/<int:id>/download/", v.template_download, name="template_download"),
    path("templates/<int:id>/like", v.toggle_like),
    path("template_versions", v.template_versions_create),
    path("template_versions/<int:id>/build", v.template_versions_build),
    path("reviews/", v.create_review, name="create_review"),
    path('auth/google', v.google_auth),
    path('users/me', v.UserMeView.as_view()),
]