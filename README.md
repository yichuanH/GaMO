# Voxify3D

# Supplementary Project Page

This folder provides two ways to view the interactive demo:

## 1. Standard Browser Usage
Open the following file directly with any browser (Chrome, Edge, Firefox, etc.)

index.html


This version embeds the models as **Data URIs**, so no server is required. Simply double-click to view.

---

## 2. Using Live Server
If you have **Live Server** (or any local HTTP server) installed, open:

index_live_server.html

This version loads external `.glb` model files. It has a clearer structure but requires server support.

---

### Notes
- For quick viewing, we recommend using **index.html**.  
- For testing the original directory structure or editing the code, use **index_live_server.html** with a server (e.g., `python -m http.server` or the VSCode Live Server extension).