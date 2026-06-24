from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.db.models import Q

from .models import Product
from .serializers import ProductSerializer
from django.shortcuts import render


def home(request):
    return render(request, "index.html")

class ProductListView(APIView):
    def get(self, request):
        limit = int(request.GET.get("limit", 20))
        category = request.GET.get("category")

        snapshot_time = request.GET.get("snapshot_time")
        cursor_updated_at = request.GET.get("cursor_updated_at")
        cursor_id = request.GET.get("cursor_id")

        if snapshot_time:
            snapshot = parse_datetime(snapshot_time)
        else:
            snapshot = timezone.now()

        queryset = Product.objects.filter(
            updated_at__lte=snapshot
        )

        if category:
            queryset = queryset.filter(category=category)

        queryset = queryset.order_by("-updated_at", "-id")

        if cursor_updated_at and cursor_id:
            cursor_time = parse_datetime(cursor_updated_at)

            queryset = queryset.filter(
                Q(updated_at__lt=cursor_time) |
                Q(updated_at=cursor_time, id__lt=int(cursor_id))
            )

        products = list(queryset[:limit])

        serializer = ProductSerializer(products, many=True)

        next_cursor = None

        if products:
            last = products[-1]
            next_cursor = {
                "cursor_updated_at": last.updated_at.isoformat(),
                "cursor_id": last.id
            }

        return Response({
            "snapshot_time": snapshot.isoformat(),
            "next_cursor": next_cursor,
            "count": len(products),
            "items": serializer.data
        })
