# MongoDB Backup and Recovery — Complete Practical

**Level:** Practical / developer-focused  
**Topics:** Replica-set backups, restore, point-in-time recovery concepts, disaster-recovery strategy, verification and operational safety.

> **Important:** This guide uses MongoDB Database Tools (`mongodump` / `mongorestore`) and terminal commands. These are not `mongosh` commands. The examples are for a disposable learning environment. Test restores before relying on any backup.

## Learning objectives

By completing this lab, you will be able to:

1. Create a logical backup from a replica set.
2. Understand the role of `--oplog` for capturing a consistent replica-set dump.
3. Restore a full dump and replay its captured oplog.
4. Verify that recovered data is usable.
5. Choose a disaster-recovery approach based on RPO, RTO, backup retention and failure scenarios.
6. Follow safe handling practices for credentials, backup storage and restore targets.

---

## 1. Backup and recovery concepts

- **Backup:** A recoverable copy of data and, depending on the method, relevant database metadata.
- **Restore:** Loading backup data into a MongoDB deployment.
- **Replica set:** Maintains multiple copies of data for availability. Replication is **not** a backup: accidental deletes, bad writes or corruption may replicate to other members.
- **RPO (Recovery Point Objective):** The maximum acceptable amount of data loss measured in time.
- **RTO (Recovery Time Objective):** The target time to restore service after an incident.
- **Logical backup:** A dump of documents and metadata, commonly made with MongoDB Database Tools.
- **Point-in-time recovery (PITR):** Restoring a base backup and replaying recorded operations to a selected time. This requires an appropriately configured backup/oplog or managed backup system; a plain dump alone does not provide arbitrary PITR.

## 2. Prerequisites

- A running MongoDB replica set, for example `rs0`.
- MongoDB Database Tools installed and available in the terminal: `mongodump` and `mongorestore`.
- Enough disk space for the backup and restored copy.
- A dedicated **test restore target**. Never experiment on production data.
- Credentials with the required read/backup and restore privileges, as appropriate for your deployment.

Check tools:

```bash
mongodump --version
mongorestore --version
mongosh --version
```

Inspect replica-set health in `mongosh`:

```javascript
rs.status()
db.hello()
```

Do not proceed until the replica set is healthy and has an elected primary.

## 3. Configure connection strings safely

Use a replica-set URI containing the replica-set name and member hosts. Set credentials through your approved secret manager or a protected environment variable; **do not commit a URI containing a username/password to GitHub**.

Example placeholders (replace hostnames and authentication options for your environment):

```bash
export MONGODB_URI='mongodb://HOST1:27017,HOST2:27017,HOST3:27017/?replicaSet=rs0'
```

For authenticated deployments, use your organisation's secret-management process. Avoid placing passwords directly in shell history or source files. TLS options may be required by your cluster.

## 4. Create a full replica-set backup

For a full logical dump of a replica set, `--oplog` captures oplog entries while the dump runs, allowing the dump to be restored with those captured operations replayed. Use a full replica-set dump; do not add database/collection filters to this oplog workflow.

Create a timestamped backup directory:

```bash
BACKUP_DIR="mongodb-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

mongodump \
  --uri="$MONGODB_URI" \
  --out="$BACKUP_DIR" \
  --oplog
```

If the command fails, treat the backup as **failed** until the cause is resolved. Do not silently use a partial output directory as a valid backup.

Check the generated files:

```bash
find "$BACKUP_DIR" -maxdepth 3 -type f -print
```

For an archive-style backup instead of a directory dump:

```bash
BACKUP_FILE="mongodb-backup-$(date +%Y%m%d-%H%M%S).archive.gz"

mongodump \
  --uri="$MONGODB_URI" \
  --archive="$BACKUP_FILE" \
  --gzip \
  --oplog
```

Choose **one** backup format per run: directory output or archive output. Store the resulting backup in a protected location, preferably encrypted and separate from the database host.

### Important notes

- The replica-set oplog workflow requires a full dump. Do not use `--oplog` together with `--db`, `--collection` or namespace filtering.
- `--oplog` is for replica-set dumps and has operational/version/topology requirements; read the Database Tools documentation for your exact version and topology.
- A successful exit code is necessary but not sufficient: also test restore and verify the recovered data.
- For very large or mission-critical deployments, evaluate filesystem snapshots, cloud-provider snapshots or MongoDB's managed backup/PITR facilities. Coordinate snapshots with MongoDB's consistency requirements.

## 5. Restore a directory backup

Restore into a **separate, empty test deployment** first. For an oplog-enabled full replica-set dump, use `--oplogReplay` to apply the captured oplog entries after restoring the dump.

Set a restore URI that points to the isolated test target:

```bash
export RESTORE_URI='mongodb://RESTORE_HOST:27017/?directConnection=true'
```

Then restore the directory dump:

```bash
mongorestore \
  --uri="$RESTORE_URI" \
  --oplogReplay \
  "$BACKUP_DIR"
```

Do not point this command at production as a trial. The restore target must be compatible with the dump and oplog replay requirements. In particular, oplog replay is intended for a full dump created with `mongodump --oplog`; namespace-filtered restores are not a substitute for a full consistent recovery.

## 6. Restore an archive backup

For the archive created in Section 4:

```bash
mongorestore \
  --uri="$RESTORE_URI" \
  --archive="$BACKUP_FILE" \
  --gzip \
  --oplogReplay
```

Run either the directory restore or the archive restore, not both for the same recovery test. If you are restoring without an oplog-enabled dump, omit `--oplogReplay`; it cannot manufacture point-in-time history that was never captured.

## 7. Verify the restored data

Connect to the **restore target** using `mongosh` and perform application-relevant checks.

```javascript
show dbs
use your_database_name
show collections

// Replace these names with a real collection and a known record.
db.your_collection.countDocuments({})
db.your_collection.findOne({})
```

For a known collection, compare its count and important records against expected values from before the backup. Validate indexes and collection metadata where applicable:

```javascript
db.your_collection.getIndexes()
db.runCommand({ listCollections: 1, nameOnly: false })
```

Finally, run application smoke tests against the restored environment. A restore is not considered proven until the data is readable and the application can use it.

## 8. Optional: create a small disposable test dataset

Run this section in `mongosh` on a **practice database only**. It is safe to rerun because it uses a stable identifier and an upsert.

```javascript
const backupLab = db.getSiblingDB("BackupRecoveryLab");
backupLab.orders.updateOne(
  { orderId: "BACKUP-LAB-001" },
  {
    $set: {
      customer: "Demo Customer",
      amount: 2499,
      status: "PLACED",
      updatedAt: new Date()
    }
  },
  { upsert: true }
);

backupLab.orders.findOne({ orderId: "BACKUP-LAB-001" });
```

Include this database in a full replica-set backup by running the full dump in Section 4. After restore, verify the `BackupRecoveryLab.orders` document exists on the restore target.

## 9. Disaster-recovery strategy

A reliable strategy has multiple layers:

1. **Define targets:** Agree RPO and RTO with the application/business owners.
2. **Use more than replication:** Maintain independent backups so a bad write or deletion does not become the only recoverable state.
3. **Automate backups:** Schedule backups and alert on failed, late or unexpectedly small outputs.
4. **Keep independent copies:** Store backups outside the primary database host/account/failure domain; consider immutable or write-protected retention.
5. **Encrypt and restrict access:** Encrypt backups in transit and at rest; limit who can read, restore or delete them.
6. **Retain deliberately:** Define daily/weekly/monthly retention and legal requirements. Test retention and deletion policies.
7. **Plan PITR where needed:** If the RPO is shorter than the backup interval, configure continuous oplog capture or a supported managed PITR solution.
8. **Test restores:** Schedule restore drills and record actual restore duration, data checks and issues.
9. **Document recovery steps:** Include contacts, credentials access procedure, DNS/application cutover, validation and rollback.
10. **Monitor recovery readiness:** Track last successful backup, backup age, storage capacity, restore-test age and RPO/RTO achievement.

### Example strategy matrix

| Failure scenario | Useful protection | Recovery approach |
|---|---|---|
| One replica-set member fails | Healthy replica set and monitoring | Replace/rebuild member and allow initial sync |
| Accidental document deletion | Independent backup; PITR if configured | Restore to isolated target, recover the needed data, validate and merge carefully |
| Bad application write replicated everywhere | Independent backup and oplog/PITR strategy | Recover to a time before the bad write where supported |
| Host or disk loss | Backups stored outside the host; tested replacement procedure | Provision replacement, restore, validate and redirect application |
| Region/account compromise | Isolated cross-region/account backups and restricted credentials | Activate clean environment and restore a verified backup |
| Backup file is corrupt | Multiple retained copies and integrity checks | Select another verified backup and investigate |

## 10. Common mistakes to avoid

- Assuming replica-set replication replaces backups.
- Backing up only to the same disk or account that may fail.
- Using `--oplogReplay` on a dump that was not created with `--oplog`.
- Trying to use full replica-set oplog replay with a filtered database/collection dump.
- Restoring over live data without understanding the effects of options such as `--drop`.
- Assuming a backup is good because the dump command exited successfully.
- Forgetting indexes, users/roles, configuration, encryption keys, certificates or external application dependencies required for full service recovery.
- Putting secrets, raw production data or private backup files in a public Git repository.

## 11. Completion checklist

- [ ] Confirm replica-set health before backup.
- [ ] Create a full replica-set dump with `--oplog` (or use an approved alternative).
- [ ] Store the backup securely outside the database host.
- [ ] Restore to a separate, empty test deployment.
- [ ] Use `--oplogReplay` only with a compatible oplog-enabled full dump.
- [ ] Verify document counts, known records, indexes and application behavior.
- [ ] Record measured backup and restore times.
- [ ] Confirm the process meets the intended RPO and RTO.

## Official documentation

- [MongoDB Database Tools — mongodump](https://www.mongodb.com/docs/database-tools/mongodump/)
- [MongoDB Database Tools — mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/)
- [MongoDB Replication](https://www.mongodb.com/docs/manual/replication/)
- [MongoDB Ops Manager / Cloud Manager Backup (where applicable)](https://www.mongodb.com/docs/ops-manager/current/)
