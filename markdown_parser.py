#!/usr/bin/env python3
"""
Markdown → JSON converter with hierarchy and proper handling of nested bullets.

Features:

- # Heading        → top-level section
- ## Heading       → subsection within current section
- ### Heading      → sub-subsection within current subsection
- Top-level bullets (-, *)   → questions in the current scope
- Indented bullets           → extra lines in the current question's content
                               (NOT new questions)
- put-description: text      → description line for the current scope
                               (section / subsection / sub-subsection)

Question title rules:
- If bullet starts with "**Title**: Question text":
    - question.title   = "Title"
    - question.content = "Question text"
- Otherwise:
    - question.title   = "<Scope Title> - Q<index>"
    - question.content = full bullet text (including any nested bullets)

Question type:
- "mchoices" for yes/no-style questions (Do/Does/Is/Are/Have/Has/etc.)
- "paragraph" otherwise

mchoices questions get responses: Yes / No / In Progress
"""

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
    current_section = None        # level 1 (#)
    current_subsection = None     # level 2 (##)
    current_subsubsection = None  # level 3 (###)

    pending_description = []      # buffered description lines for current scope
    collecting_question = False
    question_lines = []           # accumulated lines for the current bullet/question

    def add_description_line(text: str):
        """
        Only collect lines prefixed with `put-description:`.
        """
        nonlocal pending_description
        m = re.match(r"^\s*put-description:\s*(.*)$", text, flags=re.IGNORECASE)
        if not m:
            return
        line = m.group(1).strip()
        if line:
            pending_description.append(line)

    def get_current_scope(create_default: bool = True):
        """
        Scope = where questions / descriptions should attach:
        - current_subsubsection if present
        - otherwise current_subsection
        - otherwise current_section
        - otherwise (if create_default) create a default top-level section
        """
        nonlocal current_section
        if current_subsubsection is not None:
            return current_subsubsection
        if current_subsection is not None:
            return current_subsection
        if current_section is not None:
            return current_section
        if not create_default:
            return None
        # default top-level section if nothing defined yet
        current_section = {
            "title": "Default Section",
            "description": "",
            "questions": [],
            "subsections": [],
            "_q_index": 0,
        }
        sections.append(current_section)
        return current_section

    def flush_description():
        nonlocal pending_description
        scope = get_current_scope(create_default=False)
        if scope and pending_description:
            # keep as multiline with \n so UI can split
            desc = "\n".join(l.strip() for l in pending_description if l.strip())
            if desc:
                scope["description"] = desc
        pending_description = []

    def next_question_index(scope: dict) -> int:
        scope["_q_index"] = scope.get("_q_index", 0) + 1
        return scope["_q_index"]

    def finalize_question():
        nonlocal question_lines, collecting_question
        if not question_lines:
            collecting_question = False
            return

        scope = get_current_scope()
        full_text = "\n".join(question_lines).strip()

        # Case 1: explicit "**Title**: Question text"
        m = re.match(r"^\*\*(.+?)\*\*\s*:\s*(.*)", full_text, flags=re.DOTALL)
        if m:
            q_title = m.group(1).strip()
            raw_content = m.group(2).strip() or full_text
        else:
            # Case 2: no explicit title → use "<Scope Title> - Q<index>"
            q_idx = next_question_index(scope)
            scope_title = scope.get("title") or "Question"
            q_title = f"{scope_title} - Q{q_idx}"
            raw_content = full_text

        # --- Split content into main text, info lines, and NA flag ---
        content_lines = raw_content.splitlines()
        main_line = None
        other_lines = []
        info_lines = []
        allow_na = False

        for raw in content_lines:
            t = raw.strip()
            if not t:
                if main_line is not None:
                    other_lines.append("")
                continue

            # Detect "na:" (or "- na:") metadata lines
            na_match = re.match(r"^(-\s*)?na:\s*(.*)$", t, flags=re.IGNORECASE)
            if na_match:
                allow_na = True
                # do not include this line in content or info
                continue

            # Detect "info:" (or "- info:")
            info_match = re.match(r"^(-\s*)?info:\s*(.*)$", t, flags=re.IGNORECASE)
            if info_match:
                info_text = (info_match.group(2) or "").strip()
                if info_text:
                    info_lines.append(info_text)
                continue

            if main_line is None:
                main_line = t
            else:
                other_lines.append(t)

        # Rebuild content without info/na lines
        if main_line is None:
            q_content = ""
        elif other_lines:
            q_content = "\n".join([main_line] + other_lines)
        else:
            q_content = main_line

        q_info = "\n".join(info_lines).strip()

        # --- Build question object + responses ---
        q_type = detect_question_type(q_content)
        responses = build_responses(q_type)

        # Add "Not Applicable" choice when allowed and question is mchoices
        if allow_na and q_type == "mchoices":
            responses.append({
                "title": "Not Applicable",
                "type": "choice",
            })

        question = {
            "title": q_title,
            "content": q_content,
            "type": q_type,
            "responses": responses,
        }

        if q_info:
            question["info"] = q_info
        if allow_na:
            question["allow_na"] = True  # handy extra flag in JSON

        scope["questions"].append(question)
        question_lines = []
        collecting_question = False

    # ----------------------------------------------------------------------
    # MAIN LOOP
    # ----------------------------------------------------------------------
    for line in lines:
        raw = line.rstrip("\n")
        stripped = raw.strip()

        # HEADINGS
        if raw.startswith("#"):
            # finish anything currently being collected
            finalize_question()
            flush_description()

            level = len(raw) - len(raw.lstrip("#"))
            title_raw = raw[level:].strip()
            title_clean = clean_heading_title(title_raw)

            if level == 1:
                # new top-level section
                current_section = {
                    "title": title_clean,
                    "description": "",
                    "questions": [],
                    "subsections": [],
                    "_q_index": 0,
                }
                sections.append(current_section)
                current_subsection = None
                current_subsubsection = None
                pending_description = []

            elif level == 2:
                # subsection inside current_section
                if current_section is None:
                    current_section = {
                        "title": "Default Section",
                        "description": "",
                        "questions": [],
                        "subsections": [],
                        "_q_index": 0,
                    }
                    sections.append(current_section)
                current_subsection = {
                    "title": title_clean,
                    "description": "",
                    "questions": [],
                    "subsections": [],
                    "_q_index": 0,
                }
                current_section.setdefault("subsections", []).append(current_subsection)
                current_subsubsection = None
                pending_description = []

            elif level == 3:
                # sub-subsection inside current_subsection (or section if no subsection)
                if current_subsection is None:
                    parent = current_section
                    if parent is None:
                        parent = {
                            "title": "Default Section",
                            "description": "",
                            "questions": [],
                            "subsections": [],
                            "_q_index": 0,
                        }
                        sections.append(parent)
                        current_section = parent
                    current_subsection = {
                        "title": "Subsection",
                        "description": "",
                        "questions": [],
                        "subsections": [],
                        "_q_index": 0,
                    }
                    parent.setdefault("subsections", []).append(current_subsection)
                current_subsubsection = {
                    "title": title_clean,
                    "description": "",
                    "questions": [],
                    "_q_index": 0,
                }
                current_subsection.setdefault("subsections", []).append(current_subsubsection)
                pending_description = []

            else:
                # level 4+ → treat as descriptive text (only if marked)
                add_description_line(title_raw)

            continue

        # BULLETS (questions or nested points)
        bullet_match = re.match(r"^(\s*)[-*]\s+(.*)$", raw)
        if bullet_match:
            indent = bullet_match.group(1) or ""
            # treat tabs as 4 spaces for rough indent measurement
            indent_width = len(indent.replace("\t", "    "))
            content = bullet_match.group(2).strip()

            if indent_width == 0:
                # Top-level bullet → new question
                finalize_question()
                flush_description()
                collecting_question = True
                question_lines = [content]
            else:
                # Indented bullet:
                if collecting_question:
                    # part of the current question content
                    question_lines.append(f"- {content}")
                else:
                    # Not in a question; can still be description if marked
                    add_description_line(content)

            continue

        # put-description line (non-bullet)
        if stripped.lower().startswith("put-description:"):
            add_description_line(raw)
            continue

        # CONTINUATION OF MULTI-LINE QUESTION
        if collecting_question:
            question_lines.append(stripped)
            continue

        # Any other text is ignored unless marked with put-description:
        # we do nothing here.

    # End-of-file cleanup
    finalize_question()
    flush_description()

    # Remove helper fields and clean empty descriptions
    for sec in sections:
        sec.pop("_q_index", None)
        if not sec.get("description"):
            sec.pop("description", None)
        for sub in sec.get("subsections", []):
            sub.pop("_q_index", None)
            if not sub.get("description"):
                sub.pop("description", None)
            for sub2 in sub.get("subsections", []):
                sub2.pop("_q_index", None)
                if not sub2.get("description"):
                    sub2.pop("description", None)
            if not sub.get("subsections"):
                sub.pop("subsections", None)
        if not sec.get("subsections"):
            sec.pop("subsections", None)

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
                out_file.write_text(
                    json.dumps(data, indent=2, ensure_ascii=False),
                    encoding="utf-8",
                )
                print(f"Wrote {out_file}")
            else:
                print(f"=== {f.name} ===")
                print(json.dumps(data, indent=2, ensure_ascii=False))
        return

    raise SystemExit(f"Input path does not exist: {input_path}")


if __name__ == "__main__":
    main()
