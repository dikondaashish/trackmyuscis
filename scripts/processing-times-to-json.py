"""
Turn readings from the USCIS processing-times tool into a snapshot for the site.
Usage: python3 scripts/processing-times-to-json.py src/lib/processing-times-data/<YYYY-MM-DD>.json part1.txt [part2.txt ...]

Each part file holds lines (or entries separated by " ¶ ") of four kinds (see docs/processing-times-refresh.md):
  #META checked^published^period
  #NOTE <n>~<USCIS note text>
  #OFF <code>~<office name>
  @<FORM>^<category code>^<category name>|<office>:<value>[W|D|Y]:<inquiry YYYY-MM-DD or ->:<note n or -> ...
"""
import json, re, sys

UNITS = {"": "Months", "M": "Months", "W": "Weeks", "D": "Days", "Y": "Years"}
meta, offices, groups = {}, {}, []
notes = []  # unique note texts, across files
for path in sys.argv[2:]:
    local = {}  # this file's note numbers → index in notes
    text = open(path).read().replace(" ¶ ", "\n")
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("#META "):
            meta["checked"], meta["published"], meta["period"] = line[6:].split("^")
        elif line.startswith("#NOTE "):
            n, _, note = line[6:].partition("~")
            if re.fullmatch(r"\$\w+", note):  # an unresolved reference in USCIS's data, not a note
                continue
            if note not in notes:
                notes.append(note)
            local[n] = notes.index(note)
        elif line.startswith("#OFF "):
            k, _, v = line[5:].partition("~")
            offices[k] = v
        elif line.startswith("@"):
            head, _, items = line[1:].partition("|")
            form, cv, name = head.split("^", 2)
            items = [":".join(it.split(":")[:3] + [str(local[it.split(":")[3]]) if it.split(":")[3] in local else "-"]) for it in items.split()]
            groups.append((form, cv, name, items))

out = {**meta, "notes": notes, "forms": {}}
skipped = []
for form, cv, name, items in groups:
    cats = out["forms"].setdefault(form, [])
    cat = next((c for c in cats if c["code"] == cv), None)
    if not cat:
        cat = {"code": cv, "name": name, "offices": []}
        cats.append(cat)
    for it in items:
        code, val, inq, note = it.split(":")
        m = re.fullmatch(r"([\d.]+)([A-Z]?)", val)
        if not m:
            skipped.append((form, cv, code, val))
            continue
        v = float(m.group(1))
        o = {"code": code, "name": offices[code], "value": int(v) if v.is_integer() else v, "unit": UNITS[m.group(2)]}
        if inq != "-":
            o["inquiry"] = inq
        if note != "-":
            o["note"] = int(note)
        cat["offices"].append(o)
for f in out["forms"].values():
    f[:] = [c for c in f if c["offices"]]
json.dump(out, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
print({k: [(c["code"], len(c["offices"])) for c in v] for k, v in out["forms"].items()})
print("skipped", skipped)
