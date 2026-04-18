#!/usr/bin/env bash
# Run capture.js for every test account sequentially.
set -u
cd "$(dirname "$0")"

ACCOUNTS=(
  "writer writer.1"
  "writer writer.2"
  "writer writer.3"
  "manager manager.1"
  "teacher teacher.1"
  "teacher teacher.2"
  "teacher teacher.3"
  "student student.1"
  "student student.2"
  "student student.3"
)

for entry in "${ACCOUNTS[@]}"; do
  IFS=' ' read -r role user <<< "$entry"
  echo ""
  echo "================================================================"
  echo "  RUN: $role / $user"
  echo "================================================================"
  node capture.js "$role" "$user" || echo "!! failed: $role/$user"
done

echo ""
echo "All done."
