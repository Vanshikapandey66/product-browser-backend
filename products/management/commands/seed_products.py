from django.core.management.base import BaseCommand
from products.models import Product
from faker import Faker
import random
from datetime import timedelta
from django.utils import timezone

fake = Faker()


class Command(BaseCommand):
    help = "Seed 200000 products"

    def handle(self, *args, **kwargs):
        Product.objects.all().delete()

        categories = [
            "electronics",
            "books",
            "fashion",
            "sports",
            "home"
        ]

        batch = []
        batch_size = 5000
        total = 200000

        for i in range(total):
            created = fake.date_time_between(
                start_date="-365d",
                end_date="now",
                tzinfo=timezone.get_current_timezone()
            )

            updated = created + timedelta(
                days=random.randint(0, 30)
            )

            batch.append(
                Product(
                    name=f"Product-{i}",
                    category=random.choice(categories),
                    price=round(random.uniform(100, 10000), 2),
                    created_at=created,
                    updated_at=updated
                )
            )

            if len(batch) >= batch_size:
                Product.objects.bulk_create(batch)
                self.stdout.write(f"Inserted {i+1}")
                batch = []

        if batch:
            Product.objects.bulk_create(batch)

        self.stdout.write(
            self.style.SUCCESS("200000 products inserted!")
        )