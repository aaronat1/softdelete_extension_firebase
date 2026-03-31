# Firestore Soft Delete

This extension intercepts Firestore document deletions and archives the document data in a separate collection instead of permanently removing it. This enables audit logging, data recovery, and compliance with data-retention policies.

## How It Works

When a document is deleted from any collection, this extension:
1. Copies the full document data to `{ARCHIVE_COLLECTION}/{originalCollection}/{documentId}`.
2. Adds a `{DELETED_AT_FIELD}` timestamp and an `_originalPath` field to the archived copy.

The original deletion still happens — this extension only preserves a copy.

## Prerequisites

- Firebase project with Firestore enabled.

## Billing

This extension uses Cloud Functions for Firebase. See [Firebase Pricing](https://firebase.google.com/pricing) for details.

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `LOCATION` | Cloud Functions region | `us-central1` |
| `ARCHIVE_COLLECTION` | Root collection for archives | `_deleted` |
| `DELETED_AT_FIELD` | Timestamp field name | `timestampDeleted` |
| `EXCLUDED_COLLECTIONS` | Collections to skip | _(empty)_ |

## Security

Make sure to apply appropriate Firestore Security Rules to the archive collection to prevent unauthorised access.
