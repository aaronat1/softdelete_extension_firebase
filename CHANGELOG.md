## Version 0.1.2

- Fix: archive path now uses 4 segments (`_deleted/{collection}/items/{docId}`) instead of 3, which was invalid for Firestore document references.

## Version 0.1.1

- Fix: set Node.js engine to 18 for Cloud Build compatibility.
- Add package-lock.json for reproducible builds.

## Version 0.1.0

- Initial release.
- Archives deleted documents at depths 1–5.
- Configurable archive collection name and deletion timestamp field.
- Automatically skips internal `_ext_` collections and the archive collection itself.
- Adds `_originalPath` for easy document restoration.
