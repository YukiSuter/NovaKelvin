from django.shortcuts import render

def ticketing_page(request):
    return render(request, "ticket_purchase.html")

def ticketing_success(request):
    return render(request, "ticket_purchase_complete.html")
