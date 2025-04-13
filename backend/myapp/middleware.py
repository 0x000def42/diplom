from django.http import HttpResponsePermanentRedirect

class MyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(':')[0]
        print(host)
        if host == '37.252.21.85':
            return HttpResponsePermanentRedirect(f'http://xdef42.ru{request.get_full_path()}')
        return self.get_response(request)
