import os
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import Template, Review, ExternalUser
from .serializers import TemplateListSerializer, TemplateSerializer, ReviewSerializer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework import status

GOOGLE_CLIENT_ID = "53718529070-ni24nagt6ja2vkn7ka5dtdla9o0aj5dv.apps.googleusercontent.com"


def get_user_from_token(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, Response({"error": "Missing or invalid Authorization header"}, status=status.HTTP_401_UNAUTHORIZED)

    token = auth_header.split(" ")[1]

    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
    except ValueError as e:
        return None, Response({"error": f"Invalid token: {str(e)}"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        user = ExternalUser.objects.get(external_id=idinfo["sub"], provider="google")
    except ExternalUser.DoesNotExist:
        return None, Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return user, None

@api_view(["GET"])
def template_list(request):
    query = request.GET.get("query", "")
    favorites_only = request.GET.get("favoritesOnly") == "true"

    user, _ = get_user_from_token(request)

    qs = Template.objects.filter(name__icontains=query)

    if favorites_only and user:
        qs = qs.filter(liked_by=user)

    return Response(TemplateListSerializer(qs, many=True).data)

@api_view(["GET"])
def template_list_meta(request):
    user, error = get_user_from_token(request)  
    if error:
        return Response({"favorites": 0})

    return Response({"favorites": user.likes.count()})

@api_view(["GET"])
def template_get(request, id):
    template = get_object_or_404(Template, id=id)
    user, error = get_user_from_token(request)
    return Response(TemplateSerializer(template, context={"user": user}).data)

@api_view(["GET"])
def template_download(request, id):
    template = get_object_or_404(Template, id=id)
    return FileResponse(template.file.open("rb"), content_type="application/xml")

@api_view(["POST"])
def toggle_like(request, id):
    user, error = get_user_from_token(request)
    if error:
        return error

    template = get_object_or_404(Template, id=id)

    if template.liked_by.filter(id=user.id).exists():
        template.liked_by.remove(user)
        liked = False
    else:
        template.liked_by.add(user)
        liked = True

    return Response({"liked": liked})

@csrf_exempt
@api_view(["POST"])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        review = serializer.save()
        return Response({"id": review.id})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

class UserMeView(APIView):
    def get(self, request):
        user, error = get_user_from_token(request)
        if error:
            return error

        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.name,
        })

    def put(self, request):
        user, error = get_user_from_token(request)
        if error:
            return error

        name = request.data.get("name", "").strip()
        if not name:
            return Response({"error": "Name is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.name = name
        user.save()

        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.name,
        })