import urllib.request
import re

url = "https://www.futbin.com/26/evolutions/1159/elite-midfielder"
req = urllib.request.Request(
    url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    }
)
try:
    f = urllib.request.urlopen(req)
    html = f.read().decode('utf-8')
    print("Fetched successfully")
    # find shooting upgrades
    shooting = re.findall(r'Shooting[^<]*', html)
    print("Shooting matches:", shooting)
except Exception as e:
    print(e)
