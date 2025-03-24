import os
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Template, Review, ExternalUser
from .serializers import TemplateSerializer, ReviewSerializer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

GOOGLE_CLIENT_ID = "53718529070-ni24nagt6ja2vkn7ka5dtdla9o0aj5dv.apps.googleusercontent.com"

@api_view(["GET"])
def template_list(request):
    query = request.GET.get("query", "")
    templates = Template.objects.filter(name__icontains=query)
    return Response(TemplateSerializer(templates, many=True).data)

@api_view(["GET"])
def template_download(request, id):
    template = get_object_or_404(Template, id=id)
    return FileResponse(template.file.open("rb"), content_type="application/xml")

@csrf_exempt
@api_view(["POST"])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        review = serializer.save()
        return Response({"id": review.id})
    return Response(serializer.errors, status=400)

def home(request):
    """Раздаёт index.html при обращении в рут"""
    index_path = os.path.join(settings.FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(open(index_path, "rb"))
    raise Http404("index.html не найден")

@csrf_exempt
@api_view(["POST"])
def google_auth(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "Missing token"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError as e:
        return Response({"error": f"Invalid token: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)

    user, _created = ExternalUser.objects.get_or_create(
        external_id=idinfo["sub"],
        provider="google",
        defaults={
            "email": idinfo.get("email"),
            "name": idinfo.get("name"),
        },
    )

    return Response({"status": "ok", "user_id": user.id})