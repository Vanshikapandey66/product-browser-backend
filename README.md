# Product Browser Backend

A scalable Django + PostgreSQL backend for browsing 200,000+ products with fast filtering and cursor-based pagination.

## Features

* Browse products sorted by newest first
* Filter by category
* Cursor-based pagination
* Prevent duplicate/missing products during concurrent updates
* Seed script for generating 200,000 products
* Simple frontend UI

## Tech Stack

* Django
* Django REST Framework
* PostgreSQL

## Setup

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file using `.env.example`

Run migrations:

```bash
python manage.py migrate
```

Seed products:

```bash
python manage.py seed_products
```

Run server:

```bash
python manage.py runserver
```

## API Endpoints

### Get products

`GET /api/products/`

### Filter by category

`GET /api/products/?category=electronics`

### Cursor pagination

`GET /api/products/?snapshot_time=...&cursor_updated_at=...&cursor_id=...`

## Architecture Decision

Offset pagination can cause duplicates or skipped records when rows are inserted or updated during browsing.

To solve this:

* Cursor pagination using `(updated_at, id)`
* Snapshot isolation using `snapshot_time`

This guarantees consistent pagination even when data changes concurrently.
