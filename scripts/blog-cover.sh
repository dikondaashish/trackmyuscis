#!/usr/bin/env bash
# Make a blog cover and its share image in one step.
#
#   scripts/blog-cover.sh <slug> "<prompt>" [focus]
#
# 1. Generates a 16:9 image with Gemini (scripts/generate-image.mjs).
# 2. Trims 0.5% off every edge, so nothing sits on the frame's border.
# 3. Saves src/assets/blog/<slug>.jpg and a 600x630 share crop in
#    src/assets/og/blog-<slug>.jpg, centred on `focus` (0 = left, 0.5 = middle, 1 = right).
#
# Covers must show what the post is about (people, documents, calendars) in the brand palette,
# with no readable text, real flags, seals or real government document designs.
set -euo pipefail

slug="$1"; prompt="$2"; focus="${3:-0.5}"
cd "$(dirname "$0")/.."
raw="$(mktemp -t cover).jpg"
cover="src/assets/blog/$slug.jpg"
og="src/assets/og/blog-$slug.jpg"

node --env-file=.env.local scripts/generate-image.mjs "$prompt" "$raw" 16:9 >/dev/null

w=$(sips -g pixelWidth "$raw" | awk '/pixelWidth/ {print $2}')
h=$(sips -g pixelHeight "$raw" | awk '/pixelHeight/ {print $2}')
tw=$(( w * 99 / 100 )); th=$(( h * 99 / 100 ))
# sips -c crops around the centre: 0.5% comes off each edge.
sips -s format jpeg -s formatOptions 85 -c "$th" "$tw" "$raw" --out "$cover" >/dev/null

# Share crop: a 600:630 slice at the requested horizontal focus, then scaled to 600x630.
cw=$(( th * 600 / 630 ))
x=$(awk -v f="$focus" -v w="$tw" -v c="$cw" 'BEGIN { x = int(f * w - c / 2); if (x < 0) x = 0; if (x > w - c) x = w - c; print x }')
sips -c "$th" "$cw" --cropOffset 0 "$x" "$cover" --out "$og" >/dev/null
sips -z 630 600 "$og" >/dev/null
rm -f "$raw"
echo "$cover ($tw x $th) and $og (600 x 630)"
