#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${MONGODB_URI:-}" ]]; then
  echo "ERROR: Set MONGODB_URI before running this script." >&2
  exit 1
fi

DB_NAME="${DB_NAME:-student_performance}"
BACKUP_ROOT="${BACKUP_ROOT:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="${BACKUP_ROOT}/${STAMP}"

mkdir -p "$DEST"
echo "Creating logical backup for database: $DB_NAME"
mongodump --uri="$MONGODB_URI" --db="$DB_NAME" --out="$DEST"
echo "Backup created at: $DEST/$DB_NAME"
echo "Keep this directory private and encrypted. Do not commit it to Git."
