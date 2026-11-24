#!/usr/bin/env python3
"""
Turn a saved Visa Bulletin page into the chart rows the blog posts use, and list what moved.

travel.state.gov blocks automated reads, so on release day open the bulletin in a normal
browser, save the page ("Save Page As… > Webpage, HTML Only") and run:

    python3 scripts/visa-bulletin-charts.py <new bulletin.html> [<previous bulletin.html>]

It prints a TypeScript object with the four charts (same shape as NOVEMBER_2026 in
src/lib/blog/posts/november-2026-visa-bulletin.ts) and, when the previous month's page is
given, every cut-off date that changed, with the number of days. Nothing is estimated: a
row or cell the script can't read stops it with an error. Check the printed charts against
the bulletin before publishing. Older bulletins can be saved from the Internet Archive.
"""
import datetime
import html
import re
import sys

COLUMNS = ["Most countries", "China", "India", "Mexico", "Philippines"]
MONTHS = {m: i + 1 for i, m in enumerate("JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split())}
EMPLOYMENT = [("1st", "EB-1"), ("2nd", "EB-2"), ("3rd", "EB-3"), ("Other Workers", "Other workers"), ("4th", "EB-4"), ("5th Unreserved", "EB-5 unreserved")]


def tables(path):
    page = open(path, encoding="utf-8", errors="replace").read()
    out = []
    for table in re.findall(r"<table.*?</table>", page, re.S | re.I):
        rows = []
        for tr in re.findall(r"<tr.*?</tr>", table, re.S | re.I):
            cells = [re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", c))).strip() for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S | re.I)]
            if cells:
                rows.append(cells)
        out.append(rows)
    return out


def cell(value, where):
    v = value.replace(" ", "").upper()
    if v in ("C", "U") or re.fullmatch(r"\d\d[A-Z]{3}\d\d", v):
        return v
    sys.exit(f"Can't read the cell {value!r} in {where}. Fix the saved page or enter this chart by hand.")


def charts(path):
    six = [t for t in tables(path) if len(t) >= 6 and len(t[0]) == 6]
    family = [t for t in six if t[0][0].lower().startswith("family")]
    employment = [t for t in six if t[0][0].lower().startswith("employment")]
    if len(family) != 2 or len(employment) != 2:
        sys.exit(f"{path}: expected two family and two employment charts, found {len(family)} and {len(employment)}. Is this the full bulletin page?")

    def family_rows(t, name):
        rows = {r[0].strip(): r[1:] for r in t[1:]}
        return [[k] + [cell(c, f"{name} {k}") for c in rows[k]] for k in ["F1", "F2A", "F2B", "F3", "F4"]]

    def employment_rows(t, name):
        out = []
        for starts, label in EMPLOYMENT:
            row = next((r for r in t[1:] if r[0].startswith(starts)), None)
            if row is None:
                sys.exit(f"{name}: no row starting with {starts!r}.")
            out.append([label] + [cell(c, f"{name} {label}") for c in row[1:]])
        set_asides = [[cell(c, f"{name} set-aside") for c in r[1:]] for r in t[1:] if r[0].startswith("5th Set Aside")]
        if set_asides and all(r == set_asides[0] for r in set_asides):
            out.append(["EB-5 set-asides"] + set_asides[0])
        else:
            for r in t[1:]:
                if r[0].startswith("5th Set Aside"):
                    out.append([re.sub(r"\s*\(.*", "", r[0]).replace("5th Set Aside:", "EB-5 set-aside:").strip()] + [cell(c, name) for c in r[1:]])
        return out

    return {
        "employmentFinal": employment_rows(employment[0], "Employment final action"),
        "employmentFiling": employment_rows(employment[1], "Employment dates for filing"),
        "familyFinal": family_rows(family[0], "Family final action"),
        "familyFiling": family_rows(family[1], "Family dates for filing"),
    }


def as_date(v):
    m = re.fullmatch(r"(\d\d)([A-Z]{3})(\d\d)", v)
    if not m:
        return None
    year = int(m.group(3))
    return datetime.date(year + (2000 if year < 50 else 1900), MONTHS[m.group(2)], int(m.group(1)))


def long(v):
    d = as_date(v)
    return d.strftime("%b %-d, %Y") if d else {"C": "Current", "U": "Unauthorized"}[v]


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    new = charts(sys.argv[1])
    print("{")
    for key, rows in new.items():
        print(f"  {key}: [")
        for r in rows:
            print("    [" + ", ".join(f'"{c}"' for c in r) + "],")
        print("  ],")
    print("}")
    if len(sys.argv) < 3:
        return
    old = charts(sys.argv[2])
    print("\nWhat moved (previous → new):")
    for key in new:
        print(f"\n{key}")
        before = {r[0]: r[1:] for r in old[key]}
        moved = False
        for r in new[key]:
            if r[0] not in before:
                print(f"  {r[0]}: not in the previous bulletin's chart")
                continue
            for col, a, b in zip(COLUMNS, before[r[0]], r[1:]):
                if a == b:
                    continue
                moved = True
                da, db = as_date(a), as_date(b)
                days = f" ({(db - da).days:+d} days)" if da and db else ""
                print(f"  {r[0]}, {col}: {long(a)} → {long(b)}{days}")
        if not moved:
            print("  no change")


if __name__ == "__main__":
    main()
