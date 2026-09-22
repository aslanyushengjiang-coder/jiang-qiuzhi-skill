#!/usr/bin/env python3
"""Verify bundled originals and dependencies without touching the browser."""
import hashlib
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'references/web-autofill/原文与依赖校验.json').read_text(encoding='utf-8'))
failures = []
for name, expected in manifest['files'].items():
    path = root / name
    if not path.is_file():
        failures.append({'file': name, 'reason': 'missing'})
    elif hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        failures.append({'file': name, 'reason': 'changed'})
print(json.dumps({'checked': len(manifest['files']), 'passed': not failures, 'failures': failures,
                  'browser_test': 'not_run', 'mode': 'integrity_only'}, ensure_ascii=False, indent=2))
sys.exit(1 if failures else 0)
