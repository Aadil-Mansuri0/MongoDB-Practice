#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${RESTORE_URI:-}" || -z "${BACKUP_DIR:-}" ]]; then
  echo "Usage: RESTORE_URI='mongodb-uri' BACKUP_DIR='./backups/<timestamp>/student_performance' bash scripts/restore-test.sh" >&2
  echo "The script restores into a separate test database by default." >&2
  exit 1
fi

SOURCE_DB="${SOURCE_DB:-student_performance}"
TARGET_DB="${TARGET_DB:-student_performance_restore_test}"

if [[ "$TARGET_DB" == "$SOURCE_DB" ]]; then
  echo "ERROR: TARGET_DB must differ from SOURCE_DB; refusing same-database restore." >&2
  exit 1
fi

echo "Restoring $SOURCE_DB into isolated database $TARGET_DB"
mongorestore --uri="$RESTORE_URI" --nsFrom="${SOURCE_DB}.*" --nsTo="${TARGET_DB}.*" "$BACKUP_DIR"
echo "Restore command completed. Verify counts, indexes and sample records in $TARGET_DB."
