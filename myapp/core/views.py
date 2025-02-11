from django.shortcuts import get_object_or_404
from django.http import FileResponse
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
    return FileResponse(open(template.file_path, "rb"), content_type="application/xml")

@api_view(["POST"])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        review = serializer.save()
        return Response({"id": review.id})
    return Response(serializer.errors, status=400)
