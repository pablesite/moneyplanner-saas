from __future__ import annotations

import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
TARGET_DIRS = [REPO_ROOT / "core" / "frontend" / "src", REPO_ROOT / "frontend" / "src"]

INLINE_STYLE_RE = re.compile(r"<[^>]+\sstyle\s*=\s*[\"']", re.IGNORECASE)
SCOPED_STYLE_RE = re.compile(r"<style\b[^>]*\bscoped\b", re.IGNORECASE)
LOCAL_STYLE_BLOCK_RE = re.compile(r"<style\b(?![^>]*\bscoped\b)[^>]*>(.*?)</style>", re.IGNORECASE | re.DOTALL)
HARDCODED_LAYOUT_RE = re.compile(
    r"\b(?:margin|padding|gap|row-gap|column-gap|max-width|min-width|width|border-radius)\s*:\s*[^;]*(?:px|rem)\b",
    re.IGNORECASE,
)

BASELINE_SCOPED_STYLE_FILES = {
    "core/frontend/src/App.vue",
    "core/frontend/src/components/HelloWorld.vue",
    "core/frontend/src/domains/net-worth/components/ItemForm.vue",
    "core/frontend/src/domains/net-worth/components/NetWorthDonut.vue",
    "core/frontend/src/domains/net-worth/components/NetWorthTimelineChart.vue",
    "core/frontend/src/views/AccountingMovementsView.vue",
    "core/frontend/src/views/BudgetDashboardView.vue",
    "core/frontend/src/views/GuidePhaseDetailView.vue",
    "core/frontend/src/views/NetWorthView.vue",
    "frontend/src/App.vue",
    "frontend/src/components/HelloWorld.vue",
    "frontend/src/domains/net-worth/components/ItemForm.vue",
    "frontend/src/domains/net-worth/components/NetWorthDonut.vue",
    "frontend/src/domains/net-worth/components/NetWorthTimelineChart.vue",
    "frontend/src/views/BudgetDashboardView.vue",
    "frontend/src/views/GuidePhaseDetailView.vue",
    "frontend/src/views/NetWorthView.vue",
}

ALLOWED_LOCAL_STYLE_FILES = BASELINE_SCOPED_STYLE_FILES | {
    "core/frontend/src/style.css",
    "core/frontend/src/styles/app.css",
    "core/frontend/src/styles/data-input.css",
    "core/frontend/src/styles/guide-home.css",
    "core/frontend/src/styles/guide-score.css",
    "core/frontend/src/styles/tailwind.css",
    "frontend/src/style.css",
    "frontend/src/styles/app.css",
    "frontend/src/styles/data-input.css",
    "frontend/src/styles/guide-home.css",
    "frontend/src/styles/guide-score.css",
    "frontend/src/styles/tailwind.css",
}


def relative_path(path: Path) -> str:
    return path.relative_to(REPO_ROOT).as_posix()


def iter_source_files() -> list[Path]:
    files: list[Path] = []
    for base_dir in TARGET_DIRS:
        if not base_dir.exists():
            continue
        files.extend(path for path in base_dir.rglob("*") if path.is_file())
    return files


def main() -> int:
    errors: list[str] = []

    for path in iter_source_files():
        rel = relative_path(path)
        if path.suffix not in {".vue", ".css"}:
            continue

        text = path.read_text(encoding="utf-8")

        if path.suffix == ".vue":
            if INLINE_STYLE_RE.search(text):
                errors.append(f"{rel}: inline style= is not allowed. Use shared classes or tokens.")

            has_scoped_style = SCOPED_STYLE_RE.search(text) is not None
            if has_scoped_style and rel not in BASELINE_SCOPED_STYLE_FILES:
                errors.append(
                    f"{rel}: new <style scoped> detected. Prefer shared styles in core/frontend/src/styles/app.css."
                )

            has_local_style_block = "<style" in text
            if has_local_style_block and rel not in ALLOWED_LOCAL_STYLE_FILES:
                for block in LOCAL_STYLE_BLOCK_RE.findall(text):
                    if HARDCODED_LAYOUT_RE.search(block):
                        errors.append(
                            f"{rel}: local hardcoded layout values detected. Prefer shared tokens/classes and see docs/frontend/frontend-visual-contract.md."
                        )
                        break

        if path.suffix == ".css" and rel not in ALLOWED_LOCAL_STYLE_FILES:
            if HARDCODED_LAYOUT_RE.search(text):
                errors.append(
                    f"{rel}: new stylesheet with hardcoded layout values detected outside shared style locations."
                )

    if errors:
        sys.stderr.write("Frontend visual guardrails failed.\n")
        sys.stderr.write("Review docs/frontend/frontend-visual-guide.md, docs/frontend/frontend-visual-contract.md, and .codex/skills/frontend-system/SKILL.md.\n\n")
        for error in errors:
            sys.stderr.write(f"- {error}\n")
        return 1

    print("Frontend visual guardrails: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
