import urllib.request
import re
import json

url = "https://www.futwiz.com/en/fc25/player/rodri/19"
req = urllib.request.Request(
    url, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
)
try:
    f = urllib.request.urlopen(req)
    html = f.read().decode('utf-8')
    # search for standard stats format in futwiz
    stats = re.findall(r'<div class="stat-val">\s*(\d+)\s*</div>\s*<div class="stat-name">([^<]+)</div>', html)
    print("Found stats:")
    for v, k in stats:
        print(f"{k.strip()}: {v}")
except Exception as e:
    print("Error:", e)
