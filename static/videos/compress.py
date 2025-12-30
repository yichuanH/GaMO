#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
批次壓縮資料夾內所有 mp4 檔案。

使用：
    python compress.py /path/to/videos
    python compress.py /path/to/videos --output /path/to/output --overwrite
"""

import argparse
import subprocess
from pathlib import Path


def run_ffmpeg(input_path: Path, output_path: Path):
    """呼叫 ffmpeg 進行壓縮：libx264, veryslow, CRF 23"""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        "ffmpeg",
        "-y",                # 自動覆寫輸出檔案
        "-i", str(input_path),
        "-c:v", "libx264",
        "-preset", "veryslow",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        str(output_path),
    ]

    print(f"[INFO] Compressing: {input_path} -> {output_path}")
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print(f"[WARN] ffmpeg 壓縮失敗：{input_path}")


def main():
    parser = argparse.ArgumentParser(description="批次壓縮資料夾中的 mp4 影片 (x264, veryslow, CRF 23)")
    parser.add_argument("input_dir", type=str, help="輸入資料夾路徑（裡面有很多 mp4）")
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="輸出資料夾（預設為 input_dir 底下的 output 資料夾）",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="如果輸出檔已存在，強制覆寫",
    )

    args = parser.parse_args()

    input_dir = Path(args.input_dir).resolve()
    if not input_dir.is_dir():
        print(f"[ERROR] 找不到資料夾：{input_dir}")
        return

    if args.output is None:
        output_dir = input_dir / "output"
    else:
        output_dir = Path(args.output).resolve()

    print(f"[INFO] Input dir : {input_dir}")
    print(f"[INFO] Output dir: {output_dir}")

    mp4_files = list(input_dir.rglob("*.mp4"))
    if not mp4_files:
        print("[INFO] 找不到任何 mp4 檔案。")
        return

    for in_path in mp4_files:
        # 相對路徑保持原本資料夾結構
        rel = in_path.relative_to(input_dir)
        out_path = output_dir / rel

        # 確保副檔名是 .mp4
        out_path = out_path.with_suffix(".mp4")

        if out_path.exists() and not args.overwrite:
            print(f"[SKIP] 輸出已存在（使用 --overwrite 可覆寫）：{out_path}")
            continue

        run_ffmpeg(in_path, out_path)

    print("[DONE] 全部處理完成。")


if __name__ == "__main__":
    main()
