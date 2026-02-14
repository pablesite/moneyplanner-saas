from __future__ import annotations

import difflib
from pathlib import Path
import sys


REPO_ROOT = Path(__file__).resolve().parents[1]

# Files intentionally mirrored across core/saas.
MIRRORED_FILE_PAIRS = [
    (
        REPO_ROOT / "core/backend/config/exceptions.py",
        REPO_ROOT / "backend/saas/exceptions.py",
    ),
]


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def main() -> int:
    has_diff = False

    for left, right in MIRRORED_FILE_PAIRS:
        left_text = _read_text(left)
        right_text = _read_text(right)
        if left_text == right_text:
            print(f"OK: {left} == {right}")
            continue

        has_diff = True
        print(f"DIFF: {left} != {right}")
        for line in difflib.unified_diff(
            left_text.splitlines(),
            right_text.splitlines(),
            fromfile=str(left),
            tofile=str(right),
            lineterm="",
        ):
            print(line)

    if has_diff:
        print("\nMirror check failed.")
        return 1

    print("\nMirror check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
