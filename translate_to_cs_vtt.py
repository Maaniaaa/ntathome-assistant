import sys
import os
import re
import json
import time
import urllib.request
import urllib.parse

sys.stdout.reconfigure(encoding='utf-8')

srt_path = r'C:\Users\Jitka\.gemini\antigravity\scratch\The_Fifth_Step_Full_Play_-_The_Fifth_Step_-_National_Theatre_at_Home_Watch_Theatre_Online.en.cc.srt'
out_cs_vtt = r'C:\Users\Jitka\.gemini\antigravity\scratch\ntathome-assistant\The_Fifth_Step.cs.vtt'

with open(srt_path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

blocks = text.strip().split('\n\n')
time_re = re.compile(r'(\d\d:\d\d:\d\d,\d\d\d)\s*-->\s*(\d\d:\d\d:\d\d,\d\d\d)')

parsed = []
for b in blocks:
    m = time_re.search(b)
    if m:
        t_start = m.group(1).replace(',', '.')
        t_end = m.group(2).replace(',', '.')
        lines = b.split('\n')[2:]
        content = ' '.join(lines).strip()
        parsed.append({'start': t_start, 'end': t_end, 'text': content})

print(f'Celkem titulkových záznamů: {len(parsed)}')

batch_size = 30
all_translations = []

for i in range(0, len(parsed), batch_size):
    batch = parsed[i:i+batch_size]
    texts = [item['text'] for item in batch]
    payload = '\n---DELIM---\n'.join(texts)
    
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=cs&dt=t&q=' + urllib.parse.quote(payload)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    success = False
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                res_str = ''.join([part[0] for part in data[0] if part[0]])
                parts = [p.strip() for p in res_str.split('---DELIM---')]
                if len(parts) == len(batch):
                    all_translations.extend(parts)
                else:
                    for it in batch:
                        u = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=cs&dt=t&q=' + urllib.parse.quote(it['text'])
                        r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(r, timeout=8) as r_resp:
                            d = json.loads(r_resp.read().decode('utf-8'))
                            all_translations.append(''.join([p[0] for p in d[0] if p[0]]).strip())
                success = True
                break
        except Exception as e:
            time.sleep(1)
            
    if not success:
        all_translations.extend([it['text'] for it in batch])
        
    print(f'Přeloženo: {len(all_translations)} / {len(parsed)}')
    time.sleep(0.2)

with open(out_cs_vtt, 'w', encoding='utf-8') as f:
    f.write('WEBVTT\n\n')
    for idx, item in enumerate(parsed):
        cs_text = all_translations[idx] if idx < len(all_translations) else item['text']
        st = item['start']
        en = item['end']
        f.write(f'{idx+1}\n{st} --> {en}\n{cs_text}\n\n')

print(f'Hotovo! České titulky uloženy do: {out_cs_vtt}')
