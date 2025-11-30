from django.shortcuts import render

def ticketing_page(request):
    return render(request, "ticket_purchase.html")
