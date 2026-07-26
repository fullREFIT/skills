#!/usr/bin/env bash
# scaffold-project.sh
# Creates the directory structure for a new orchestrated project.
# Usage: ./scripts/scaffold-project.sh <project-name>

set -euo pipefail

PROJECT_NAME="${1:?Usage: scaffold-project.sh <project-name>}"

# Sanitize project name for directory use
DIR_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

if [ -d "$DIR_NAME" ]; then
    echo "ERROR: Directory '$DIR_NAME' already exists."
    exit 1
fi

echo "Creating project directory: $DIR_NAME"

mkdir -p "$DIR_NAME"/{cowork,claude-code,cursor,warp,n8n,resources}

# Create placeholder orchestration plan
cat > "$DIR_NAME/00-orchestration-plan.md" << 'EOF'
---
project_name: REPLACE_ME
created: REPLACE_DATE
total_tasks: 0
platforms_used: []
estimated_total_effort: TBD
---

# Orchestration Plan

This file will be populated by the Project Orchestrator skill.
EOF

# Replace placeholders
sed -i "s/REPLACE_ME/$PROJECT_NAME/" "$DIR_NAME/00-orchestration-plan.md"
sed -i "s/REPLACE_DATE/$(date +%Y-%m-%d)/" "$DIR_NAME/00-orchestration-plan.md"

# Create resources placeholder
cat > "$DIR_NAME/resources/project-brief.md" << 'EOF'
# Project Brief

Paste or write the full project brief here. This file is referenced by all task files.
EOF

echo ""
echo "Project scaffolded at: ./$DIR_NAME/"
echo ""
echo "Directory structure:"
find "$DIR_NAME" -type f -o -type d | sort | head -20
echo ""
echo "Next steps:"
echo "  1. Add project brief to $DIR_NAME/resources/project-brief.md"
echo "  2. Run the Project Orchestrator skill to generate task files"
