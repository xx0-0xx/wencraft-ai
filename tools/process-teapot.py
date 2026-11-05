"""
把原始紫砂壶 GLB 的壶盖合拢到壶身，并输出适配 Three.js 的模型。

用法：
  python tools/process-teapot.py ^
    --source "C:\Users\xyc\Pictures\ai文创\茶壶.glb" ^
    --out apps/web/public/assets/models/teapot.glb

依赖：trimesh、numpy（首次安装：pip install trimesh numpy）
"""

from __future__ import annotations

import argparse
import json
import os

import numpy as np
import trimesh

# 原始模型检查结果（Z-up，单位与 GLB 一致）
LID_MIN_Z = 30.747570
BODY_RIM_Z = 20.0
LID_RIM_RADIUS = 16.3332
BODY_RIM_RADIUS = 16.5831
SEATED_OVERLAP = 0.25
LID_VERTEX_Z_THRESHOLD = 25.0


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, help="原始茶壶 GLB 路径")
    parser.add_argument(
        "--out",
        default="apps/web/public/assets/models/teapot.glb",
        help="输出 GLB 路径",
    )
    args = parser.parse_args()

    scene = trimesh.load(args.source, force="scene")
    mesh = list(scene.geometry.values())[0]

    lid_mask = mesh.vertices[:, 2] > LID_VERTEX_Z_THRESHOLD
    if not lid_mask.any():
        raise SystemExit("未找到壶盖顶点，请检查模型坐标与阈值")

    radial_scale = BODY_RIM_RADIUS / LID_RIM_RADIUS
    drop = LID_MIN_Z - (BODY_RIM_Z - SEATED_OVERLAP)

    vertices = mesh.vertices.copy()
    vertices[lid_mask, 0] *= radial_scale
    vertices[lid_mask, 1] *= radial_scale
    vertices[lid_mask, 2] -= drop
    mesh.vertices = vertices

    # 烘焙为 Y-up，壶嘴朝 -X、壶把朝 +X，壶底落在 y=0
    mesh.apply_transform(
        trimesh.transformations.rotation_matrix(np.deg2rad(-90), [1, 0, 0])
    )
    mesh.apply_transform(
        trimesh.transformations.rotation_matrix(np.deg2rad(180), [0, 1, 0])
    )
    mesh.apply_transform(trimesh.transformations.translation_matrix([0, 18, 0]))
    mesh.vertex_normals

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    mesh.export(out_path, file_type="glb", include_normals=True)

    meta = {
        "name": "经典紫砂壶（壶盖已合拢）",
        "source": os.path.basename(args.source),
        "vertices": int(len(mesh.vertices)),
        "faces": int(len(mesh.faces)),
        "bounds": [
            [round(float(value), 3) for value in row] for row in mesh.bounds
        ],
        "extents": [round(float(value), 3) for value in mesh.extents],
        "up_axis": "Y",
        "base_y": 0.0,
        "uv": "absent (decals are used)",
        "normals": "generated, outward",
        "lid_fix": {
            "radial_scale": round(radial_scale, 5),
            "vertical_shift": round(drop, 5),
            "seated_overlap": SEATED_OVERLAP,
        },
        "orientation": "spout -X (left), handle +X (right), front +Z",
    }
    meta_path = os.path.join(os.path.dirname(out_path), "teapot-meta.json")
    with open(meta_path, "w", encoding="utf-8") as handle:
        json.dump(meta, handle, ensure_ascii=False, indent=2)

    print(f"已输出 {out_path}")
    print(json.dumps(meta, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
