from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from ticketing import models as ts_models
from .serializers import ConcertSerializer, TicketTypeSummarySerializer


class ConcertsView(APIView):
    def get(self, request):
        concerts = ts_models.Concert.objects.all()
        serializer = ConcertSerializer(concerts, many=True)
        return Response(serializer.data)

    def post(self, request):
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class ConcertTicketTypesView(APIView):
    """
    GET /api/tickets/concert/tickettypes?concert_id=<ID>
    Returns ticket type details for that concert.
    """

    def get(self, request):
        concert_id = request.query_params.get("concert_id")
        if not concert_id:
            return Response(
                {"detail": "concert_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        concert = get_object_or_404(ts_models.Concert, pk=concert_id)

        # All ticket types for this concert (using related_name="ticket_types")
        ticket_types = concert.ticket_types.all().order_by("position")

        serializer = TicketTypeSummarySerializer(ticket_types, many=True)
        return Response(serializer.data)
