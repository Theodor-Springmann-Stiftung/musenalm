#!/usr/bin/env bash
set -euo pipefail

SSH_HOST="admin@musenalm.de"
SSH_KEY="$HOME/.ssh/tss_admin"
SSH_PORT="2222"

REMOTE_TMP="/home/admin/backup"

LOCAL_TMP="/tmp/musenalm-backup-download"
DISK_DEVICE="/dev/disk/by-label/STUFF"
MOUNT_POINT="/mnt/stuff"
BACKUP_DIR="backup"

TIMESTAMP="$(date +%Y-%m-%d_%H-%M-%S)"
ARCHIVE_NAME="musenalm-backup-$TIMESTAMP.tar.gz"

echo "[1/7] Creating backup on server..."

ssh -i "$SSH_KEY" -p "$SSH_PORT" "$SSH_HOST" bash <<EOF
set -euo pipefail

REMOTE_TMP="$REMOTE_TMP"
ARCHIVE_NAME="$ARCHIVE_NAME"

echo "[server 1/4] Preparing remote backup directory..."
mkdir -p "\$REMOTE_TMP"
rm -rf "\$REMOTE_TMP"/*
mkdir -p "\$REMOTE_TMP/db"

echo "[server 2/4] Creating consistent SQLite backups..."

docker run --rm \
  -v musenalm:/data \
  -v "\$REMOTE_TMP/db":/backup \
  alpine \
  sh -c "
    apk add --no-cache sqlite >/dev/null &&
    echo '  - backing up data.db...' &&
    sqlite3 /data/pb_data/data.db \".backup /backup/data.sqlite\" &&
    ls -lh /backup/data.sqlite &&
    echo '  - backing up auxiliary.db...' &&
    sqlite3 /data/pb_data/auxiliary.db \".backup /backup/auxiliary.sqlite\" &&
    ls -lh /backup/auxiliary.sqlite
  "

echo "[server 3/4] Creating final archive with DB backups and storage folder..."

docker run --rm \
  -v musenalm:/data:ro \
  -v "\$REMOTE_TMP":/backup \
  alpine \
  sh -c "
    cd /data/pb_data &&
    echo '  - storage size:' &&
    du -sh storage &&
    tar -czvf /backup/\$ARCHIVE_NAME \
      -C /backup db \
      -C /data/pb_data storage
  "

echo "[server 4/4] Final archive size:"
ls -lh "\$REMOTE_TMP/\$ARCHIVE_NAME"

echo "Remote backup ready: \$REMOTE_TMP/\$ARCHIVE_NAME"
EOF

echo "[2/7] Downloading backup archive..."

rm -rf "$LOCAL_TMP"
mkdir -p "$LOCAL_TMP"

scp -i "$SSH_KEY" -P "$SSH_PORT" \
  "$SSH_HOST:$REMOTE_TMP/$ARCHIVE_NAME" \
  "$LOCAL_TMP/$ARCHIVE_NAME"

echo "[3/7] Mounting backup disk if needed..."

sudo mkdir -p "$MOUNT_POINT"

if ! mountpoint -q "$MOUNT_POINT"; then
  sudo mount "$DISK_DEVICE" "$MOUNT_POINT"
else
  echo "Disk already mounted at $MOUNT_POINT"
fi

echo "[4/7] Creating backup folder..."

sudo mkdir -p "$MOUNT_POINT/$BACKUP_DIR"

echo "[5/7] Copying archive to backup disk..."

if command -v rsync >/dev/null 2>&1; then
  sudo rsync --info=progress2 "$LOCAL_TMP/$ARCHIVE_NAME" "$MOUNT_POINT/$BACKUP_DIR/"
else
  sudo cp -v "$LOCAL_TMP/$ARCHIVE_NAME" "$MOUNT_POINT/$BACKUP_DIR/"
fi

echo "[6/7] Syncing and unmounting..."

sync
sudo umount "$MOUNT_POINT"

echo "[7/7] Cleaning temporary files..."

rm -rf "$LOCAL_TMP"

ssh -i "$SSH_KEY" -p "$SSH_PORT" "$SSH_HOST" \
  "rm -rf '$REMOTE_TMP'/*"

echo "Done."
echo "Backup saved as: $ARCHIVE_NAME"
