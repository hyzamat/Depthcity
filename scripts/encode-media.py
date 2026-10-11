"""Encode the site's media from the game's 4K trailer shot masters (E:/DEPTHCITY Trailer/_work/shots).
Needs ffmpeg (winget Gyan.FFmpeg.Essentials) and Pillow with AVIF support.

usage: python scripts/encode-media.py scripts/media-spec.json public/media [--only name,name] [--jobs N]

spec.json:
{
  "clips":  [{"name": "war-landing", "src": "H03_beach_landing_low", "in": 0.5, "dur": 8,
              "tallX": 0.5, "tiers": ["1080", "1440", "tall"]}],
  "stills": [{"name": "hero-island", "src": "A18_island_hero_wide", "at": 3.5,
              "portrait": true, "portraitX": 0.5}],
  "scrub":  [{"name": "city-night", "src": "A14_sunset_timelapse", "in": 0, "dur": 7, "tallX": 0.5}]
}
Clips  -> cine/<name>-{1080,1440,tall}.mp4 + cine/<name>.webp + cine/<name>-tall.webp (first frame).
Stills -> <name>-{960,1600,2560,3840}.avif, <name>-{960,1600,2560}.webp, (+ -portrait.avif/.webp).
Scrub  -> daynight/<name>-wide-{1080,1440}.mp4 + <name>-tall.mp4 (+ -tall-720) + posters; short GOP for seeking.
"""
import glob, json, os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

FF = glob.glob(r"C:\Users\dell\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_*\ffmpeg-*\bin")[0]
FFMPEG = os.path.join(FF, "ffmpeg.exe")
SHOTS = r"E:\DEPTHCITY Trailer\_work\shots"
GAMEPLAY = r"E:\DEPTHCITY Trailer\_work\gameplay"
TMP = os.path.join(os.environ.get("TEMP", "."), "depth-city-media-tmp")
os.makedirs(TMP, exist_ok=True)

# x264 settings (see memory: cinematic-capture): moving-camera foliage footage, CRF 28 / 29 at 1440.
CLIP_TIERS = {
    "1080": dict(vf="scale=1920:1080:flags=lanczos", crf=28),
    "1440": dict(vf="scale=2560:1440:flags=lanczos", crf=29),
    "tall": dict(vf=None, crf=28),  # centre(ish) 9:16 crop of the 4K frame -> 1080x1920
}
AVIF_Q = {960: 74, 1600: 72, 2560: 70, 3840: 66}
WEBP_Q = 82


def src_path(name):
    p = os.path.join(SHOTS, name + ".mp4")
    if not os.path.exists(p):
        raise FileNotFoundError(p)
    return p


def tall_crop(x):
    """crop filter for a 9:16 window of a 3840x2160 frame; x = window centre as a fraction of the width."""
    w = 1215
    left = int(round(min(max(x * 3840 - w / 2, 0), 3840 - w)))
    return f"crop={w}:2160:{left}:0,scale=1080:1920:flags=lanczos"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(" ".join(cmd) + "\n" + r.stderr[-2000:])


def x264(src, t_in, dur, vf, crf, out, gop=120, extra=()):
    tmp = out + ".part.mp4"
    run([FFMPEG, "-v", "error", "-y", "-ss", f"{t_in:.3f}", "-t", f"{dur:.3f}", "-i", src, "-an",
         "-vf", vf + ",format=yuv420p", "-c:v", "libx264", "-preset", "slower", "-crf", str(crf),
         "-profile:v", "high", "-g", str(gop), "-bf", "3", "-pix_fmt", "yuv420p",
         "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
         *extra, "-movflags", "+faststart", tmp])
    os.replace(tmp, out)


def frame_png(src, t, out):
    run([FFMPEG, "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", "-pix_fmt", "rgb24", out])
    return Image.open(out).convert("RGB")


def clip(c, media):
    src = src_path(c["src"])
    t_in, dur = float(c.get("in", 0.3)), float(c.get("dur", 8))
    tiers = c.get("tiers", ["1080", "1440", "tall"])
    d = os.path.join(media, "cine")
    os.makedirs(d, exist_ok=True)
    for t in tiers:
        vf = tall_crop(c.get("tallX", 0.5)) if t == "tall" else CLIP_TIERS[t]["vf"]
        x264(src, t_in, dur, vf, c.get("crf", {}).get(t, CLIP_TIERS[t]["crf"]) if isinstance(c.get("crf"), dict) else CLIP_TIERS[t]["crf"],
             os.path.join(d, f"{c['name']}-{t}.mp4"))
    # posters = the first frame the video shows, so the cross-fade from poster to video is invisible
    im = frame_png(src, t_in, os.path.join(TMP, c["name"] + "_poster.png"))
    im.resize((1920, 1080), Image.LANCZOS).save(os.path.join(d, c["name"] + ".webp"), quality=80, method=6)
    x = c.get("tallX", 0.5)
    left = int(round(min(max(x * 3840 - 1215 / 2, 0), 3840 - 1215)))
    im.crop((left, 0, left + 1215, 2160)).resize((1080, 1920), Image.LANCZOS).save(
        os.path.join(d, c["name"] + "-tall.webp"), quality=80, method=6)
    return c["name"]


def still(s, media):
    src = src_path(s["src"])
    im = frame_png(src, float(s["at"]), os.path.join(TMP, s["name"] + ".png"))
    if im.size != (3840, 2160):
        im = im.resize((3840, 2160), Image.LANCZOS)
    for w, q in AVIF_Q.items():
        r = im if w == 3840 else im.resize((w, round(w * 9 / 16)), Image.LANCZOS)
        r.save(os.path.join(media, f"{s['name']}-{w}.avif"), quality=q, subsampling="4:4:4", speed=4)
        if w != 3840:
            r.save(os.path.join(media, f"{s['name']}-{w}.webp"), quality=WEBP_Q, method=6)
    if s.get("portrait"):
        x = s.get("portraitX", 0.5)
        left = int(round(min(max(x * 3840 - 1215 / 2, 0), 3840 - 1215)))
        p = im.crop((left, 0, left + 1215, 2160))
        p.save(os.path.join(media, f"{s['name']}-portrait.avif"), quality=70, subsampling="4:4:4", speed=4)
        p.save(os.path.join(media, f"{s['name']}-portrait.webp"), quality=WEBP_Q, method=6)
    return s["name"]


def scrub(s, media):
    """Scroll-scrubbed footage: every frame must seek fast, so a short GOP (g 24) and no B-frame pyramid."""
    src = src_path(s["src"])
    t_in, dur = float(s.get("in", 0)), float(s["dur"])
    d = os.path.join(media, "daynight")
    os.makedirs(d, exist_ok=True)
    extra = ("-x264-params", "b-pyramid=none")
    x264(src, t_in, dur, "scale=1920:1080:flags=lanczos", 23, os.path.join(d, f"{s['name']}-wide-1080.mp4"), gop=24, extra=extra)
    x264(src, t_in, dur, "scale=2560:1440:flags=lanczos", 24, os.path.join(d, f"{s['name']}-wide-1440.mp4"), gop=24, extra=extra)
    x264(src, t_in, dur, tall_crop(s.get("tallX", 0.5)), 26, os.path.join(d, f"{s['name']}-tall.mp4"), gop=24, extra=extra)
    x264(src, t_in, dur, tall_crop(s.get("tallX", 0.5)).replace("1080:1920", "720:1280"), 27,
         os.path.join(d, f"{s['name']}-tall-720.mp4"), gop=24, extra=extra)
    im = frame_png(src, t_in, os.path.join(TMP, s["name"] + "_poster.png"))
    im.resize((1920, 1080), Image.LANCZOS).save(os.path.join(d, f"{s['name']}-wide-poster.webp"), quality=80, method=6)
    x = s.get("tallX", 0.5)
    left = int(round(min(max(x * 3840 - 1215 / 2, 0), 3840 - 1215)))
    im.crop((left, 0, left + 1215, 2160)).resize((1080, 1920), Image.LANCZOS).save(
        os.path.join(d, f"{s['name']}-tall-poster.webp"), quality=80, method=6)
    return s["name"]


def play(c, media):
    """Portrait gameplay loop (with the game's HUD) for the phone frames: 720x1280 + a first-frame poster."""
    src = os.path.join(GAMEPLAY, c["src"] + ".mp4")
    d = os.path.join(media, "play")
    os.makedirs(d, exist_ok=True)
    x264(src, float(c["in"]), float(c["dur"]), "scale=720:1280:flags=lanczos", 26, os.path.join(d, c["name"] + ".mp4"), gop=60)
    im = frame_png(src, float(c["in"]), os.path.join(TMP, c["name"] + "_poster.png"))
    im.resize((720, 1280), Image.LANCZOS).save(os.path.join(d, c["name"] + ".webp"), quality=78, method=6)
    return c["name"]


def main():
    spec = json.load(open(sys.argv[1]))
    media = sys.argv[2]
    only = None
    jobs = 6
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    if "--jobs" in sys.argv:
        jobs = int(sys.argv[sys.argv.index("--jobs") + 1])
    tasks = []
    for c in spec.get("clips", []):
        tasks.append((clip, c))
    for s in spec.get("stills", []):
        tasks.append((still, s))
    for s in spec.get("scrub", []):
        tasks.append((scrub, s))
    for s in spec.get("play", []):
        tasks.append((play, s))
    if only:
        tasks = [t for t in tasks if t[1]["name"] in only]

    def go(t):
        fn, item = t
        try:
            return f"ok   {fn.__name__:5} {fn(item, media)}"
        except Exception as e:  # keep going; report at the end
            return f"FAIL {fn.__name__:5} {item['name']}: {e}"

    with ThreadPoolExecutor(jobs) as ex:
        for line in ex.map(go, tasks):
            print(line, flush=True)


if __name__ == "__main__":
    main()
