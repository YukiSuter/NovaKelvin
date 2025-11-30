from rest_framework import serializers
from ticketing import models as ts_models


class TicketTypeSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ts_models.TicketType
        fields = (
            "id",
            "ticket_label",
            "qty_total",
            "qty_available",
            "qty_sold",
            "display_ticket",
            "price",
            "description",
        )


class ConcertSerializer(serializers.ModelSerializer):
    # British format date: 25/12/2025
    concert_date = serializers.DateField(
        format="%d/%m/%Y",                    # output format
        input_formats=["%d/%m/%Y", "iso-8601"]  # what you accept on POST/PUT
    )


    class Meta:
        model = ts_models.Concert
        fields = [
            "id",
            "concert_name",
            "concert_date",
            "concert_time",
            "concert_location",
            "concert_description",
        ]
