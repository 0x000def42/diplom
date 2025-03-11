import os
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Template, Review
from .serializers import TemplateSerializer, ReviewSerializer

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