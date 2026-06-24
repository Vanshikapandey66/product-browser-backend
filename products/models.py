from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("electronics", "Electronics"),
        ("books", "Books"),
        ("fashion", "Fashion"),
        ("sports", "Sports"),
        ("home", "Home"),
    ]

    name = models.CharField(max_length=255)

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        db_index=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    def __str__(self):
        return self.name
    
    class Meta:
      indexes = [
        models.Index(fields=['-updated_at', '-id']),
        models.Index(fields=['category', '-updated_at', '-id']),
    ]