#!/usr/bin/env python3

from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path


ROOT = Path("musenalm-data/Almanach-Bilder")
OUTPUT = Path("bilder.txt")
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}
CONTENT_RE = re.compile(r"(?i)^alm[-.]?(\d+)-(\d+)(.*)$")
VALID_SUFFIX_RE = re.compile(r"^(?:|,\d+|-\d+)$")


def rel(path: Path) -> str:
    try:
        return path.relative_to(Path.cwd()).as_posix()
    except ValueError:
        return path.as_posix()


def scan_images(root: Path):
    duplicate_map: dict[int, dict[str, list[str]]] = defaultdict(lambda: defaultdict(list))
    invalid_suffixes: list[tuple[int, str, str]] = []
    unparseable: list[str] = []
    total_images = 0
    parseable_images = 0

    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() not in IMAGE_EXTS:
            continue

        total_images += 1
        stem = path.stem
        match = CONTENT_RE.match(stem)
        if not match:
            unparseable.append(rel(path))
            continue

        parseable_images += 1
        content_id = int(match.group(2))
        suffix = match.group(3)
        rel_path = rel(path)
        normalized_slot = normalize_slot(suffix)
        if normalized_slot is None:
            invalid_suffixes.append((content_id, suffix, rel(path)))
        else:
            duplicate_map[content_id][normalized_slot].append(rel_path)

    duplicates = []
    for content_id, slots in duplicate_map.items():
        duplicate_paths = []
        duplicate_slots = []
        for slot, paths in sorted(slots.items()):
            if len(paths) <= 1:
                continue
            duplicate_slots.append((slot, sorted(paths)))
            duplicate_paths.extend(sorted(paths))
        if duplicate_slots:
            duplicates.append((content_id, duplicate_slots, duplicate_paths))

    sorted_duplicates = sorted(
        duplicates,
        key=lambda item: (-len(item[2]), item[0]),
    )
    invalid_suffixes.sort(key=lambda item: (item[0], item[2]))
    unparseable.sort()

    return {
        "total_images": total_images,
        "parseable_images": parseable_images,
        "duplicates": sorted_duplicates,
        "invalid_suffixes": invalid_suffixes,
        "unparseable": unparseable,
    }


def normalize_slot(suffix: str) -> str | None:
    if suffix == "":
        return "base"
    if not VALID_SUFFIX_RE.match(suffix):
        return None
    return f"slot-{int(suffix[1:])}"


def build_report(data: dict) -> str:
    lines: list[str] = []
    lines.append("# Summary")
    lines.append(f"Total image files scanned: {data['total_images']}")
    lines.append(f"Total parseable image files: {data['parseable_images']}")
    lines.append(f"Total duplicate Inhaltsnummern: {len(data['duplicates'])}")
    lines.append(f"Total files with invalid suffixes: {len(data['invalid_suffixes'])}")
    lines.append(f"Total files with unparseable content ids: {len(data['unparseable'])}")
    lines.append("")

    lines.append("# Duplicate Inhaltsnummern")
    if not data["duplicates"]:
        lines.append("None")
    else:
        for content_id, duplicate_slots, duplicate_paths in data["duplicates"]:
            lines.append(f"INHNR {content_id} ({len(duplicate_paths)} duplicate files)")
            for slot, paths in duplicate_slots:
                lines.append(f"  {slot}")
                for path in paths:
                    lines.append(f"    {path}")
    lines.append("")

    lines.append("# Invalid Filename Cases")
    lines.append("## Unparseable content id")
    if not data["unparseable"]:
        lines.append("None")
    else:
        for path in data["unparseable"]:
            lines.append(f"  {path}")
    lines.append("")

    lines.append("## Invalid suffix after content id")
    if not data["invalid_suffixes"]:
        lines.append("None")
    else:
        for content_id, suffix, path in data["invalid_suffixes"]:
            lines.append(f"  INHNR {content_id} suffix {suffix!r}: {path}")
    lines.append("")

    return "\n".join(lines)


def main() -> int:
    if not ROOT.exists():
        print(f"image root not found: {ROOT}", file=sys.stderr)
        return 1

    data = scan_images(ROOT)
    OUTPUT.write_text(build_report(data), encoding="utf-8")

    print(f"Scanned image files: {data['total_images']}")
    print(f"Duplicate Inhaltsnummern: {len(data['duplicates'])}")
    print(f"Invalid suffix cases: {len(data['invalid_suffixes'])}")
    print(f"Unparseable content ids: {len(data['unparseable'])}")
    print(f"Wrote report to {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
