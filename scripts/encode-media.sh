#!/usr/bin/env bash
# Turn source media into the small web files the theatre journey looks for.
#
#   scripts/encode-media.sh voice   <in-audio> <lineId>    -> src/assets/voice/<lineId>.mp3
#   scripts/encode-media.sh music   <in-audio> [seconds=3] -> src/assets/music/theatre-loop.mp3
#   scripts/encode-media.sh curtain <in-video>             -> src/assets/curtain/curtain.mp4
#                                                             + curtain-poster.webp
#
# lineId is one of: curtain about skills projects contact
# Voice files stay local (git-ignored); music and curtain files are committed.
# Needs ffmpeg and ffprobe on PATH.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"

die() { echo "encode-media: $*" >&2; exit 1; }
command -v ffmpeg >/dev/null || die "ffmpeg not found on PATH"
command -v ffprobe >/dev/null || die "ffprobe not found on PATH"

duration() {
  ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$1"
}

report() {
  local size
  size=$(wc -c <"$1")
  printf '%s  %s KB  %ss\n' "${1#"$root"/}" "$((size / 1024))" "$(duration "$1")"
}

ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }

voice() {
  local in=$1 id=$2
  case $id in curtain | about | skills | projects | contact) ;; *) die "unknown line id: $id" ;; esac
  local out="$root/src/assets/voice/$id.mp3"
  mkdir -p "$(dirname "$out")"
  ff -i "$in" -ac 1 -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
    -c:a libmp3lame -b:a 64k "$out"
  report "$out"
}

music() {
  local in=$1 fade=${2:-3}
  local out="$root/src/assets/music/theatre-loop.mp3"
  mkdir -p "$(dirname "$out")"
  local length cut
  length=$(duration "$in")
  cut=$(awk -v l="$length" -v f="$fade" 'BEGIN { printf "%.3f", l - f }')
  # Loop point: the track's last seconds (B) crossfade into its start (A), so
  # the file's end runs straight on into its beginning when it repeats
  ff -i "$in" -filter_complex \
    "[0:a]atrim=0:$cut,asetpts=PTS-STARTPTS[a];[0:a]atrim=$cut,asetpts=PTS-STARTPTS[b];[b][a]acrossfade=d=$fade:c1=tri:c2=tri,loudnorm=I=-20:TP=-1.5[out]" \
    -map "[out]" -ac 2 -c:a libmp3lame -b:a 128k "$out"
  report "$out"
}

curtain() {
  local in=$1
  local dir="$root/src/assets/curtain"
  local out="$dir/curtain.mp4"
  mkdir -p "$dir"
  local crf=28 limit=$((2 * 1024 * 1024))
  while :; do
    ff -i "$in" -vf "scale=1280:-2" -an -c:v libx264 -preset slow -crf "$crf" \
      -pix_fmt yuv420p -movflags +faststart "$out"
    [ "$(wc -c <"$out")" -le "$limit" ] && break
    crf=$((crf + 2))
    [ "$crf" -le 40 ] || die "could not get the curtain under 2 MB"
  done
  ff -i "$out" -frames:v 1 -c:v libwebp -quality 80 "$dir/curtain-poster.webp"
  echo "crf $crf"
  report "$out"
  printf '%s  %s KB\n' "src/assets/curtain/curtain-poster.webp" \
    "$(($(wc -c <"$dir/curtain-poster.webp") / 1024))"
}

cmd=${1:-}
shift || true
case $cmd in
  voice) [ $# -eq 2 ] || die "usage: voice <in-audio> <lineId>"; voice "$@" ;;
  music) [ $# -ge 1 ] || die "usage: music <in-audio> [seconds]"; music "$@" ;;
  curtain) [ $# -eq 1 ] || die "usage: curtain <in-video>"; curtain "$@" ;;
  *) die "usage: encode-media.sh voice|music|curtain …" ;;
esac
