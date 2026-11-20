#!/usr/bin/env python3
"""Comprueba la integridad del paquete descargado contra SHA256SUMS.txt.
Uso: python scripts/verificar_paquete.py [--allow-missing-originals]
No requiere paquetes externos ni modifica archivos.
"""
from pathlib import Path
from hashlib import sha256
import sys
base=Path(__file__).resolve().parent.parent
sha_file=base/'SHA256SUMS.txt'
if not sha_file.exists():
    raise SystemExit('FALLO: SHA256SUMS.txt no disponible')
allow='--allow-missing-originals' in sys.argv
checked=missing=failed=0
for line in sha_file.read_text(encoding='utf-8').splitlines():
    if not line or line.startswith('#'): continue
    sha,relative=line.split('  ',1)
    f=base/relative
    if not f.is_file():
        if allow and relative.startswith('contexto/fuentes-originales/'):
            print('IGNORADO (originales no versionados):',relative); missing+=1; continue
        print('FALTA:',relative);failed+=1;continue
    actual=sha256(f.read_bytes()).hexdigest()
    if actual!=sha:
        print('MODIFICADO:',relative);failed+=1
    else:
        checked+=1
print(f'Integridad: {checked} OK, {missing} originales omitidos, {failed} fallos')
raise SystemExit(1 if failed else 0)
