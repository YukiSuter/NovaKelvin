from django.urls import path
from .views import ConcertsView, ConcertTicketTypesView

urlpatterns = [
    path('tickets/concerts/', ConcertsView.as_view(), name='items'),
    path(
            "tickets/concert/tickettypes/",
            ConcertTicketTypesView.as_view(),
            name="concert_ticket_types",
        ),
]