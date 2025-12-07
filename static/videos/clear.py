#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import shutil
from pathlib import Path

def clear_scene_dir(scene_dir: Path):
    """清空單一 scene 資料夾裡的所有內容（保留 scene 資料夾本身）"""
    if not scene_dir.is_dir():
        return

    print(f"[Scene] 清空資料夾內容：{scene_dir}")
    for child in scene_dir.iterdir():
        try:
            if child.is_dir():
                print(f"  - 刪除子資料夾：{child}")
                shutil.rmtree(child)
            else:
                print(f"  - 刪除檔案：{child}")
                child.unlink()
        except Exception as e:
            print(f"  [Warn] 刪除失敗 {child}: {e}")

def main():
    parser = argparse.ArgumentParser(
        description="清空 ROOT 底下每一個 scene 資料夾中的內容（保留 scene 資料夾本身）"
    )
    parser.add_argument(
        "root",
        type=str,
        help="ROOT 路徑（底下會有多個 scene 資料夾）",
    )
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        raise FileNotFoundError(f"ROOT 不存在：{root}")
    if not root.is_dir():
        raise NotADirectoryError(f"ROOT 不是資料夾：{root}")

    print(f"[Root] 掃描 ROOT：{root}")

    # 只處理 ROOT 下第一層的子資料夾（視為 scene）
    scene_dirs = [p for p in root.iterdir() if p.is_dir()]
    if not scene_dirs:
        print("[Info] ROOT 底下沒有任何子資料夾可清空。")
        return

    for scene_dir in scene_dirs:
        clear_scene_dir(scene_dir)

    print("[Done] 所有 scene 資料夾內容已清空。")

if __name__ == "__main__":
    main()
