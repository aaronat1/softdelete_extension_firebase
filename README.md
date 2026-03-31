# Firestore Soft Delete - Firebase Extension

> Instead of permanently deleting Firestore documents, this extension archives them to a `_deleted` collection with a deletion timestamp. Perfect for audit trails, data recovery, and regulatory compliance.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Firebase Extension](https://img.shields.io/badge/Firebase-Extension-FFCA28?logo=firebase)](https://firebase.google.com/products/extensions)

## Why Use This Extension?

Permanent deletion in Firestore is irreversible. Whether for GDPR compliance, auditing requirements, or simply protecting against accidental deletions, you need a safety net. This extension automatically archives every deleted document so you can recover data when needed.

- **Automatic archiving** — every deleted document is saved before it disappears
- **Full data preservation** — all original fields are kept intact
- **Traceable** — adds `timestampDeleted` and `_originalPath` to the archive
- **Recoverable** — restore any document by reading it from the archive collection
- **Configurable** — choose your archive collection name and exclude specific collections

## How It Works

```
1. User deletes document:     users/alice
2. Extension copies data to:  _deleted/users/alice
3. Archive includes:          { ...originalData, timestampDeleted, _originalPath: "users/alice" }
```

The original deletion proceeds normally — this extension only preserves a copy.

## Installation

### Option 1: Firebase CLI

```
firebase ext:install aaronat1/firestore-soft-delete --project=YOUR_PROJECT_ID
```

### Option 2: From Source

```bash
git clone https://github.com/aaronat1/softdelete_extension_firebase.git
cd softdelete_extension_firebase
firebase ext:install . --project=YOUR_PROJECT_ID
```

## Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `LOCATION` | Cloud Functions deployment region | `us-central1` |
| `ARCHIVE_COLLECTION` | Root collection for archived documents | `_deleted` |
| `DELETED_AT_FIELD` | Timestamp field name on archived docs | `timestampDeleted` |
| `EXCLUDED_COLLECTIONS` | Comma-separated collections to skip | _(empty)_ |

## Restoring a Document

```javascript
// Read the archived document
const archived = await db.doc("_deleted/users/alice").get();
const data = archived.data();

// Restore it to its original path
await db.doc(data._originalPath).set(data);

// Optionally remove from archive
await archived.ref.delete();
```

## Archive Structure

```
_deleted/                    (archive root)
  users/                     (mirrors original collection name)
    alice                    (same document ID)
      |- name: "Alice"
      |- email: "alice@example.com"
      |- timestampDeleted: Timestamp
      |- _originalPath: "users/alice"
```

## Tech Stack

- **Runtime:** Node.js 20
- **Language:** TypeScript
- **Trigger:** Firestore `onDelete` (depths 1-5)
- **Dependencies:** `firebase-admin`, `firebase-functions`

## Security Considerations

- Apply Firestore Security Rules to the archive collection to prevent unauthorized access.
- The extension automatically skips internal `_ext_` collections and the archive collection itself to avoid loops.

## Billing

This extension uses Cloud Functions for Firebase (Blaze plan required). Each document deletion triggers one function invocation and one document write. See [Firebase Pricing](https://firebase.google.com/pricing).

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.

## Author

**[@aaronat1](https://github.com/aaronat1)**
