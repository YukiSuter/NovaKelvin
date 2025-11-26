from django.shortcuts import render

# Create your views here.

def home(request):
    """
    Homepage view displaying upcoming concert highlights
    """
    return render(request, 'website/../home.html')

def about(request):
    """
    About view
    """
    return render(request, 'website/../about.html')