#!/bin/bash
# Reset Pollify Database - Drop and Recreate

echo "🔄 Resetting Pollify Database..."

# Drop and recreate database
PGPASSWORD=postgres psql -U postgres -h localhost << 'EOF'
DROP DATABASE IF EXISTS pollify_db;
CREATE DATABASE pollify_db;
\c pollify_db
\q
EOF

echo "✅ Database reset complete!"
echo "🚀 Now run: ./gradlew bootRun"
