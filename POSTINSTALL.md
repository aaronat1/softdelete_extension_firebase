# Firestore Soft Delete — Setup Complete

The extension is active. Deleted documents will be automatically archived to:

```
${param:ARCHIVE_COLLECTION}/{collection}/{documentId}
```

Each archived document includes:
- All original fields
- **`${param:DELETED_AT_FIELD}`** — server timestamp of deletion
- **`_originalPath`** — the Firestore path where the document lived

## Restore a Document

```js
const archived = await db
  .collection("${param:ARCHIVE_COLLECTION}")
  .doc("users")
  .collection("userId")
  .get();

// Or directly:
const snap = await db.doc("${param:ARCHIVE_COLLECTION}/users/userId123").get();
await db.doc(snap.data()._originalPath).set(snap.data());
```

## Excluded Collections

`${param:EXCLUDED_COLLECTIONS}`

## Support

[GitHub repository](https://github.com/aaronat1/firestore-soft-delete)
