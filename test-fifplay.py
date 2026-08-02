import urllib.request
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = []
    def handle_data(self, d):
        self.text.append(d)
    def get_data(self):
        return ''.join(self.text)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

url = "https://www.fifplay.com/fc-25/player/231866/rodri/"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    f = urllib.request.urlopen(req)
    html = f.read().decode('utf-8')
    text = strip_tags(html)
    # find lines with stats
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Just print the middle section of the text
    for i, line in enumerate(lines):
        if "Acceleration" in line or "Sprint Speed" in line or "Vision" in line:
            print(f"{line}")
except Exception as e:
    print("Error:", e)
