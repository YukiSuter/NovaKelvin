from ticketing import models as ts_models
from rest_framework.response import Response
from django.utils import timezone
from rest_framework import status

import stripe

def handle_webhook(event):
    try:
        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            webhook_successful(event)

        # Handle payment failure
        elif event['type'] == 'checkout.session.async_payment_failed':
            webhook_payment_failed(event)

        return Response({"status": "success"})
    except Exception as e:
        return Response({"status": "failed", "detail": str(e)})

def webhook_successful(event):
    session = event['data']['object']
    session_id = session['id']

    try:
        # Find the pending order
        order = ts_models.Order.objects.get(stripe_session_id=session_id)

        # Update order with customer details and confirm it
        order.customer_email = session.get('customer_details', {}).get('email', '')
        order.customer_name = session.get('customer_details', {}).get('name', '')
        order.status = 'confirmed'
        order.confirmed_at = timezone.now()
        order.save()

        line_items = stripe.checkout.Session.list_line_items(session_id)['data']

        print(line_items)

        # Create ticket in DB
        for line_item in line_items:
            print(line_item)
            ticket_type = ts_models.TicketType.objects.get(price_id=line_item["price"]["id"])

            print(ticket_type)

            for x in range(line_item['quantity']):
                ticket = ts_models.Ticket()
                ticket.ticket_type = ticket_type
                ticket.name = order.customer_name
                ticket.email = order.customer_email
                ticket.transaction_ID = order.stripe_session_id
                ticket.for_concert = ticket_type.for_concert
                ticket.change_log += f"[{timezone.now()}] - Ticket added to database."
                ticket.save()

                ticket_type.recalculate_quantities_for_cluster(ticket_type)

        # TODO: Send confirmation email here
        print(f"Order {order.id} confirmed for {order.customer_email}")
        print(f"Total: {order.total_amount} {order.currency}")
    except ts_models.Order.DoesNotExist:
        print(f"Order not found for session {session_id}")
        return Response(
            {"detail": "Order not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)

def webhook_payment_failed(event):
    session = event['data']['object']
    session_id = session['id']

    try:
        order = ts_models.Order.objects.get(stripe_session_id=session_id)
        order.status = 'failed'
        order.save()
        print(f"Payment failed for order {order.id}")
    except ts_models.Order.DoesNotExist:
        pass