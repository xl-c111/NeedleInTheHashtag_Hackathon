"""
Backup all data from Supabase to local JSON files.
Run this regularly to protect your data!

Usage:
    python3 scripts/backup_database.py
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

# Load environment variables
root_dir = backend_dir.parent
load_dotenv(root_dir / '.env')

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not service_key:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
    sys.exit(1)

supabase: Client = create_client(url, service_key)

# Create backups directory
backup_dir = root_dir / "data" / "backups"
backup_dir.mkdir(parents=True, exist_ok=True)

# Timestamp for this backup
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

print("=" * 60)
print("BACKING UP SUPABASE DATA")
print("=" * 60)
print(f"Timestamp: {timestamp}")
print(f"Backup directory: {backup_dir}")
print()


def backup_table(table_name: str):
    """Backup a single table to JSON."""
    print(f"Backing up {table_name}...")

    try:
        # Fetch all data
        response = supabase.table(table_name).select("*").execute()
        data = response.data

        # Save to JSON file
        filename = f"{table_name}_{timestamp}.json"
        filepath = backup_dir / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"  ✓ Saved {len(data)} rows to {filename}")
        return len(data)

    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return 0


# Backup all tables
tables = ["posts", "profiles", "diary_entries", "user_favorites"]
total_rows = 0

for table in tables:
    rows = backup_table(table)
    total_rows += rows

# Create latest backup symlink (copy)
print("\nCreating 'latest' backup copies...")
for table in tables:
    latest_file = backup_dir / f"{table}_latest.json"
    timestamped_file = backup_dir / f"{table}_{timestamp}.json"

    if timestamped_file.exists():
        # Copy to latest
        import shutil
        shutil.copy2(timestamped_file, latest_file)
        print(f"  ✓ {table}_latest.json")

print()
print("=" * 60)
print("BACKUP COMPLETE")
print("=" * 60)
print(f"Total rows backed up: {total_rows}")
print(f"Backup location: {backup_dir}")
print()
print("Backup files:")
for table in tables:
    filename = f"{table}_{timestamp}.json"
    filepath = backup_dir / filename
    if filepath.exists():
        size_kb = filepath.stat().st_size / 1024
        print(f"  - {filename} ({size_kb:.1f} KB)")

print()
print("To restore from backup, run:")
print("  python3 scripts/restore_backup.py <backup_timestamp>")
print(f"  python3 scripts/restore_backup.py {timestamp}")
