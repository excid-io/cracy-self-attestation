#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path

YES_NO_PREFIXES = (
    "do ", "does ", "have ", "has ", "is ", "are ",
    "will ", "can ", "shall ", "should ", "did ",
    "was ", "were ",
)


def detect_question_type(text: str) -> str:
    stripped = text.strip().lower()
    return "mchoices" if any(stripped.startswith(p) for p in YES_NO_PREFIXES) else "paragraph"


def build_responses(q_type: str):
    if q_type != "mchoices":
        return []
    return [
        {"title": "Yes", "type": "choice"},
        {"title": "No", "type": "choice"},
        {
            "title": "In Progress",
            "description": "Work is underway but not yet completed.",
            "type": "choice",
        },
    ]


def clean_heading_title(raw_title: str) -> str:
    """
    Clean heading titles a bit:
    - Strip wrapping **...** if the entire heading is bolded.
    """
    title = raw_title.strip()
    m = re.fullmatch(r"\*\*(.+?)\*\*", title)
    if m:
        return m.group(1).strip()
    return title


def parse_markdown(md_text: str):
    lines = md_text.splitlines()

    sections = []
    current_section = None
    pending_description = []
    collecting_question = False
    question_lines = []  # accumulated lines for the current bullet/question

    def flush_description():
        nonlocal pending_description
        if current_section and pending_description:
            desc = " ".join(l.strip() for l in pending_description if l.strip())
            if desc:
                current_section["description"] = desc
            pending_description = []

    def ensure_section():
        """Ensure there is a current section; create a default one if needed."""
        nonlocal current_section
        if current_section is None:
            current_section = {
                "title": "Default Section",
                "description": "",
                "questions": [],
                "_q_index": 0,
            }
            sections.append(current_section)

    def next_question_index() -> int:
        """Increment and return the question index for the current section."""
        ensure_section()
        current_section["_q_index"] = current_section.get("_q_index", 0) + 1
        return current_section["_q_index"]

    def finalize_question():
        """Convert question_lines into a question entry."""
        nonlocal question_lines
        if not question_lines:
            return

        ensure_section()
        full_text = "\n".join(question_lines).strip()

        # Case 1: explicit "**Title**: Question text"
        m = re.match(r"^\*\*(.+?)\*\*\s*:\s*(.*)", full_text, flags=re.DOTALL)
        if m:
            q_title = m.group(1).strip()
            q_content = m.group(2).strip() or full_text
        else:
            # Case 2: no explicit title → use "<Section Title> - Q<index>"
            q_idx = next_question_index()
            section_title = current_section.get("title") or "Question"
            q_title = f"{section_title} - Q{q_idx}"
            q_content = full_text

        q_type = detect_question_type(q_content)
        question = {
            "title": q_title,
            "content": q_content,
            "type": q_type,
            "responses": build_responses(q_type),
        }
        current_section["questions"].append(question)
        question_lines = []

    for line in lines:
        raw = line.rstrip("\n")
        stripped = raw.strip()

        # Headings: treat # and ## as section titles
        if raw.startswith("#"):
            finalize_question()
            flush_description()

            level = len(raw) - len(raw.lstrip("#"))
            title_raw = raw[level:].strip()

            if level <= 2:  # only top-level and second-level headings become sections
                current_section = {
                    "title": clean_heading_title(title_raw),
                    "description": "",
                    "questions": [],
                    "_q_index": 0,
                }
                sections.append(current_section)
                pending_description = []
            # lower-level headings could be treated differently if needed
            continue

        # Bullet start: new question
        if stripped.startswith("- ") or stripped.startswith("* "):
            finalize_question()
            flush_description()

            collecting_question = True
            # strip the bullet marker
            content = re.sub(r"^[-*]\s*", "", stripped)
            question_lines = [content]
            continue

        # Continuation of current question (multi-line bullet text)
        if collecting_question:
            # If we hit a completely blank line, keep it as separator
            if stripped == "":
                question_lines.append("")
            else:
                question_lines.append(stripped)
            continue

        # Non-empty, non-bullet and non-heading: treat as section description
        if stripped:
            ensure_section()
            pending_description.append(stripped)

    # End-of-file cleanup
    finalize_question()
    flush_description()

    # Remove helper fields and empty descriptions
    for sec in sections:
        sec.pop("_q_index", None)
        if not sec.get("description"):
            sec.pop("description", None)

    return {"sections": sections}


def convert_file(path: Path):
    return parse_markdown(path.read_text(encoding="utf-8"))


def main():
    parser = argparse.ArgumentParser(description="Convert markdown question files to JSON.")
    parser.add_argument("input", help="Markdown file or directory")
    parser.add_argument("-o", "--output", help="Output file or directory")
    args = parser.parse_args()

    input_path = Path(args.input)
    output = Path(args.output) if args.output else None

    if input_path.is_file():
        data = convert_file(input_path)
        if output:
            output.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        else:
            print(json.dumps(data, indent=2, ensure_ascii=False))
        return

    if input_path.is_dir():
        md_files = list(input_path.glob("*.md"))
        if not md_files:
            print("No markdown files found.")
            return

        if output:
            output.mkdir(parents=True, exist_ok=True)

        for f in md_files:
            data = convert_file(f)
            if output:
                out_file = output / (f.stem + ".json")
                out_file.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
                print(f"Wrote {out_file}")
            else:
                print(f"=== {f.name} ===")
                print(json.dumps(data, indent=2, ensure_ascii=False))
        return

    raise SystemExit(f"Input path does not exist: {input_path}")


if __name__ == "__main__":
    main()
