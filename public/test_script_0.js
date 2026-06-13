
    var BAZA_PRACOWNIKOW = [];
    let BAZA_MIESIAC = [];
    let BAZA_KARTY = [];
    let DO_ROZLICZENIA = [];
    let KARTY_WOLNE = [];

    let sUmo = { col: '', asc: true };
    let sEwi = { col: '', asc: true };
    let sKar = { col: '', asc: true };
    let selectedEwiId = null;
    window.umowyKolejka = {};
    window.lastExpandedUmowa = null;

    function getInitials(nameString) {
        if(!nameString || nameString==="-") return "?";
        const parts = nameString.trim().split(' ');
        if(parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
        return nameString.substring(0, 2).toUpperCase();
    }

    let alertTimeout;
    function pokazPowiadomienie(msg, isError = false) {
        const box = document.getElementById('alert-box');
        document.getElementById('alert-msg').innerHTML = isError ? `<i class="fas fa-exclamation-circle me-2"></i>${msg}` : `<i class="fas fa-check-circle me-2"></i>${msg}`;
        box.style.backgroundColor = isError ? '#dc2626' : '#16a34a';
        box.style.display = 'block';
        clearTimeout(alertTimeout);
        if(!isError) alertTimeout = setTimeout(() => { box.style.display = 'none'; }, 3000);
    }

    function rotacjaStatus(dataRotacji) {
        // zwraca: 'Aktywny' | 'Rotuje' | 'Zakończono'
        if (!dataRotacji || dataRotacji === "-") return 'Aktywny';
        const parts = String(dataRotacji).split('.');
        if (parts.length !== 3) return 'Aktywny';
        const d = new Date(parts[2], parts[1]-1, parts[0]);
        const dzis = new Date(); dzis.setHours(0,0,0,0);
        return d < dzis ? 'Zakończono' : 'Rotuje';
    }

    // =========================================================================
    //  ZAKŁADKA: PRACOWNICY (ewidencja miesiąca)
    // =========================================================================
    function renderEwidencjaMiesiaca(lista) {
        let html = '';
        if (lista.length === 0) {
            html = `<tr><td colspan="4" class="text-center text-muted py-5"><i class="fas fa-folder-open fs-1 opacity-25 mb-2"></i><br>Brak pracowników.</td></tr>`;
        }
        lista.forEach(p => {
            const st = rotacjaStatus(p.dataRotacji);
            let badge = '<span class="badge badge-ok">Aktywny</span>';
            if (st === 'Rotuje') badge = '<span class="badge badge-rot">Rotuje</span>';
            if (st === 'Zakończono') badge = '<span class="badge badge-end">Zakończono</span>';
            const sel = (selectedEwiId === p.id) ? 'selected' : '';
            html += `<tr class="table-row-cursor ${sel}" onclick="wybierzPracownika('${p.id}')">
              <td class="ps-4">
                 <div class="d-flex align-items-center">
                    <div class="avatar-small me-3">${getInitials(p.imie)}</div>
                    <div><span class="fw-bold text-navy d-block">${p.imie}</span><small class="text-muted">EMP ID: ${p.sap}</small></div>
                 </div>
              </td>
              <td><span class="badge-dept">${p.dzial || '-'}</span></td>
              <td>${p.brygada ? `<span class="badge-brygada">${p.brygada}</span>` : '-'}</td>
              <td class="text-end pe-4">${badge}</td>
            </tr>`;
        });
        document.getElementById('tabela-miesiac-cialo').innerHTML = html;
        document.getElementById('count-lista').innerText = lista.length;
    }

    function populujFiltryEwidencji() {
        const dzialy = [...new Set(BAZA_MIESIAC.map(p => p.dzial).filter(Boolean))].sort();
        const bryg = [...new Set(BAZA_MIESIAC.map(p => p.brygada).filter(Boolean))].sort();
        const dSel = document.getElementById('filterDzialEwi');
        const bSel = document.getElementById('filterBrygadaEwi');
        if (dSel) { dSel.innerHTML = '<option value="">Wszystkie Działy</option>'; dzialy.forEach(d => dSel.add(new Option(d, d))); }
        if (bSel) { bSel.innerHTML = '<option value="">Wszystkie Brygady</option>'; bryg.forEach(b => bSel.add(new Option(b, b))); }
    }

    function filtrujEwidencjeMiesiaca() {
        const q = (document.getElementById('szukajEwidencja').value || '').toLowerCase();
        const fd = document.getElementById('filterDzialEwi').value;
        const fb = document.getElementById('filterBrygadaEwi').value;
        const fs = document.getElementById('filterStatusEwi').value;
        let wyniki = BAZA_MIESIAC.filter(p => {
            const mImie = p.imie.toLowerCase().includes(q) || String(p.sap).includes(q);
            const mD = !fd || p.dzial === fd;
            const mB = !fb || p.brygada === fb;
            const mS = !fs || rotacjaStatus(p.dataRotacji) === fs;
            return mImie && mD && mB && mS;
        });
        if (sEwi.col) {
            wyniki.sort((a,b) => {
                let va = String(a[sEwi.col]||'').toLowerCase(), vb = String(b[sEwi.col]||'').toLowerCase();
                if (va < vb) return sEwi.asc ? -1 : 1;
                if (va > vb) return sEwi.asc ? 1 : -1;
                return 0;
            });
        }
        renderEwidencjaMiesiaca(wyniki);
    }

    function sortEwi(col) {
        if (sEwi.col === col) sEwi.asc = !sEwi.asc; else { sEwi.col = col; sEwi.asc = true; }
        filtrujEwidencjeMiesiaca();
    }

    function wybierzPracownika(id) {
        const p = BAZA_MIESIAC.find(x => x.id === id);
        if (!p) return;
        selectedEwiId = id;
        document.getElementById('detail-empty').style.display = 'none';
        document.getElementById('detail-content').style.display = 'block';
        document.getElementById('detail-avatar').innerText = getInitials(p.imie);
        document.getElementById('detail-name').innerText = p.imie;
        document.getElementById('detail-sap').innerText = p.sap;
        document.getElementById('detail-start').innerText = p.dataStartuFormat || '-';
        document.getElementById('d-dzial').innerText = p.dzial || '-';
        document.getElementById('d-brygada').innerText = p.brygada || '-';
        document.getElementById('d-tel').innerText = p.telefon || '-';

        const st = rotacjaStatus(p.dataRotacji);
        const box = document.getElementById('d-rot-alert-box');
        if (st !== 'Aktywny') {
            box.style.display = 'block';
            box.className = st === 'Zakończono' ? 'rot-alert-danger' : 'rot-alert';
            document.getElementById('d-rot-title').innerText = (st === 'Zakończono' ? 'Współpraca zakończona: ' : 'Zaplanowana rotacja: ') + p.dataRotacji;
        } else {
            box.style.display = 'none';
        }
        // input daty rotacji (format yyyy-mm-dd)
        const inp = document.getElementById('d-input-rotacja');
        if (p.dataRotacji && p.dataRotacji.split('.').length === 3) {
            const pp = p.dataRotacji.split('.'); inp.value = `${pp[2]}-${pp[1]}-${pp[0]}`;
        } else inp.value = '';

        // karta do zwrotu? (osoba rotująca z aktywną kartą)
        const karta = BAZA_KARTY.find(k => k.imie === p.imie && k.status === 'Wydana');
        const kbox = document.getElementById('d-karta-zwrocona-box');
        if (karta && st !== 'Aktywny') {
            kbox.style.display = 'block';
            document.getElementById('d-karta-zwrocona').checked = false;
        } else {
            kbox.style.display = 'none';
        }
        filtrujEwidencjeMiesiaca();
    }

    function zapiszRotacjeZPanelu() {
        const p = BAZA_MIESIAC.find(x => x.id === selectedEwiId);
        if (!p) { pokazPowiadomienie('Najpierw wybierz pracownika.', true); return; }
        const v = document.getElementById('d-input-rotacja').value;
        p.dataRotacji = v ? v.split('-').reverse().join('.') : '';
        google.script.run.withSuccessHandler(() => {}).zapiszDateRotacjiServer(p.imie, p.dataRotacji, 'Czerwiec 2026');
        pokazPowiadomienie(v ? 'Zapisano datę rotacji.' : 'Usunięto datę rotacji.');
        wybierzPracownika(selectedEwiId);
        odswiezStatystykiMiesiaca();
    }

    function oznaczKarteJakoZwrocona() {
        const p = BAZA_MIESIAC.find(x => x.id === selectedEwiId);
        if (!p) return;
        const karta = BAZA_KARTY.find(k => k.imie === p.imie && k.status === 'Wydana');
        if (karta) {
            karta.status = 'Oddana';
            pokazPowiadomienie(`Karta ${karta.nrKarty} oznaczona jako oddana.`);
            renderKartyWszystko();
        }
    }

    function odswiezStatystykiMiesiaca() {
        let wszyscy = 0, rot = 0;
        BAZA_MIESIAC.forEach(p => {
            const st = rotacjaStatus(p.dataRotacji);
            if (st !== 'Zakończono') wszyscy++;
            if (st === 'Rotuje') rot++;
        });
        document.getElementById('ml-wszyscy').innerText = wszyscy;
        document.getElementById('ml-rot').innerText = rot;
    }

    // --- dodawanie / edycja pracownika ---
    function otworzDodawanie() {
        document.getElementById('modalPracownikTytul').innerHTML = '<i class="fas fa-user-plus me-2"></i>Dodaj pracownika';
        document.getElementById('p-stare-imie').value = '';
        ['p-imie','p-sap','p-dzial','p-brygada','p-tel','p-start','p-rotacja'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('p-btn-usun').classList.add('d-none');
        new bootstrap.Modal(document.getElementById('modalPracownik')).show();
    }

    function otworzEdycje() {
        const p = BAZA_MIESIAC.find(x => x.id === selectedEwiId);
        if (!p) { pokazPowiadomienie('Najpierw wybierz pracownika z listy.', true); return; }
        document.getElementById('modalPracownikTytul').innerHTML = '<i class="fas fa-user-edit me-2"></i>Edytuj dane pracownika';
        document.getElementById('p-stare-imie').value = p.imie;
        document.getElementById('p-imie').value = p.imie;
        document.getElementById('p-sap').value = p.sap;
        document.getElementById('p-dzial').value = p.dzial || '';
        document.getElementById('p-brygada').value = p.brygada || '';
        document.getElementById('p-tel').value = p.telefon || '';
        document.getElementById('p-start').value = p.dataStartuRaw || '';
        document.getElementById('p-rotacja').value = (p.dataRotacji && p.dataRotacji.split('.').length===3) ? p.dataRotacji.split('.').reverse().join('-') : '';
        document.getElementById('p-btn-usun').classList.remove('d-none');
        new bootstrap.Modal(document.getElementById('modalPracownik')).show();
    }

    function zapiszPracownika() {
        const imie = document.getElementById('p-imie').value.trim();
        if (!imie) { alert('Podaj imię i nazwisko.'); return; }
        const stare = document.getElementById('p-stare-imie').value;
        const rotRaw = document.getElementById('p-rotacja').value;
        const startRaw = document.getElementById('p-start').value;
        const rec = {
            imie: imie,
            sap: document.getElementById('p-sap').value.trim(),
            dzial: document.getElementById('p-dzial').value.trim(),
            brygada: document.getElementById('p-brygada').value.trim(),
            telefon: document.getElementById('p-tel').value.trim(),
            dataRotacji: rotRaw ? rotRaw.split('-').reverse().join('.') : '',
            dataStartuRaw: startRaw || '',
            dataStartuFormat: startRaw ? startRaw.split('-').reverse().join('.') : '01.06.2026'
        };
        if (stare) {
            const idx = BAZA_MIESIAC.findIndex(x => x.imie === stare);
            if (idx >= 0) { rec.id = BAZA_MIESIAC[idx].id; BAZA_MIESIAC[idx] = rec; }
            google.script.run.withSuccessHandler(()=>{}).edytujPracownikaMiesiacServer(stare, rec, 'Czerwiec 2026');
            pokazPowiadomienie('Zapisano zmiany pracownika.');
        } else {
            rec.id = 'miesiac_row_new_' + Date.now();
            BAZA_MIESIAC.push(rec);
            google.script.run.withSuccessHandler(()=>{}).dodajPracownikaMiesiacServer(rec, 'Czerwiec 2026');
            pokazPowiadomienie('Dodano nowego pracownika.');
        }
        bootstrap.Modal.getInstance(document.getElementById('modalPracownik'))?.hide();
        populujFiltryEwidencji();
        filtrujEwidencjeMiesiaca();
        odswiezStatystykiMiesiaca();
    }

    function usunPracownika() {
        const stare = document.getElementById('p-stare-imie').value;
        if (!stare) return;
        if (!confirm(`Usunąć pracownika ${stare} z ewidencji?`)) return;
        BAZA_MIESIAC = BAZA_MIESIAC.filter(x => x.imie !== stare);
        google.script.run.withSuccessHandler(()=>{}).usunPracownikaZBazyUmowServer(stare);
        bootstrap.Modal.getInstance(document.getElementById('modalPracownik'))?.hide();
        selectedEwiId = null;
        document.getElementById('detail-content').style.display = 'none';
        document.getElementById('detail-empty').style.display = 'block';
        filtrujEwidencjeMiesiaca();
        odswiezStatystykiMiesiaca();
        pokazPowiadomienie('Pracownik usunięty.');
    }

    // =========================================================================
    //  ZAKŁADKA: KARTY
    // =========================================================================
    function renderKartyWszystko() {
        filtrujKarty();
        renderWolneKarty();
        renderDoRozliczenia();
        // statystyki
        let wydane = 0, oddane = 0, rozl = 0;
        BAZA_KARTY.forEach(k => {
            if (k.status === 'Wydana') wydane++; else oddane++;
            if (k.doRozliczenia && k.status === 'Wydana') rozl++;
        });
        document.getElementById('k-wydane').innerText = wydane;
        document.getElementById('k-rozliczenie').innerText = rozl;
        document.getElementById('k-oddane').innerText = KARTY_WOLNE.length;
    }

    function renderKarty(lista) {
        let html = '';
        if (lista.length === 0) html = `<tr><td colspan="6" class="text-center text-muted py-5"><i class="fas fa-folder-open fs-1 opacity-25 mb-2"></i><br>Brak kart.</td></tr>`;
        lista.forEach(p => {
            let badge = p.status === 'Wydana'
                ? '<span class="badge badge-solid-blue">Aktywna</span>'
                : '<span class="badge badge-solid-green">Zwrócona</span>';
            if (p.doRozliczenia && p.status === 'Wydana') badge += ' <span class="badge badge-subtle-danger ms-1">Do rozliczenia</span>';
            html += `<tr>
              <td class="ps-4 fw-bold text-navy">${p.kadrowy}</td>
              <td>${p.imie}</td>
              <td><span class="fw-bold text-primary"><i class="fas fa-id-card me-1 opacity-50"></i>${p.nrKarty}</span></td>
              <td><span class="badge-dept">${p.dzial || '-'}</span></td>
              <td>${badge}</td>
              <td class="text-end pe-4">
                 <button class="btn btn-sm btn-outline-primary me-1" onclick="otworzModalaKarty('${p.id}')" title="Edytuj"><i class="fas fa-edit"></i></button>
                 <button class="btn btn-sm btn-outline-danger" onclick="usunKarte('${p.id}')" title="Usuń"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`;
        });
        document.getElementById('tabela-karty-cialo').innerHTML = html;
        document.getElementById('count-karty').innerText = lista.length;
    }

    function filtrujKarty() {
        const q = (document.getElementById('szukajKarty').value || '').toLowerCase();
        const fs = document.getElementById('filterStatusKarty').value;
        let wyniki = BAZA_KARTY.filter(k => {
            const m = k.imie.toLowerCase().includes(q) || String(k.kadrowy).includes(q) || String(k.nrKarty).includes(q);
            let ms = true;
            if (fs === 'wydana') ms = (k.status === 'Wydana');
            else if (fs === 'oddana') ms = (k.status === 'Oddana');
            return m && ms;
        });
        if (sKar.col) {
            wyniki.sort((a,b) => {
                let va = String(a[sKar.col]||'').toLowerCase(), vb = String(b[sKar.col]||'').toLowerCase();
                if (va < vb) return sKar.asc ? -1 : 1;
                if (va > vb) return sKar.asc ? 1 : -1;
                return 0;
            });
        }
        renderKarty(wyniki);
    }

    function sortKar(col) {
        if (sKar.col === col) sKar.asc = !sKar.asc; else { sKar.col = col; sKar.asc = true; }
        filtrujKarty();
    }

    function renderWolneKarty() {
        const wrap = document.getElementById('lista-wolnych-kart');
        document.getElementById('liczba-wolnych-kart').innerText = KARTY_WOLNE.length;
        if (!KARTY_WOLNE.length) { wrap.innerHTML = '<span class="text-muted small">Brak wolnych kart.</span>'; return; }
        wrap.innerHTML = KARTY_WOLNE.map(nr =>
            `<span class="badge bg-white text-navy border shadow-sm px-3 py-2" style="font-size:0.85rem;"><i class="fas fa-id-card me-1 text-primary"></i>${nr}</span>`
        ).join('');
    }

    function renderDoRozliczenia() {
        const wrap = document.getElementById('lista-do-rozliczenia');
        const lista = BAZA_KARTY.filter(k => k.doRozliczenia && k.status === 'Wydana');
        if (!lista.length) { wrap.innerHTML = '<span class="text-muted small">Brak osób do rozliczenia.</span>'; return; }
        wrap.innerHTML = lista.map(k =>
            `<div class="bg-white rounded border p-2 d-flex justify-content-between align-items-center">
               <div><span class="fw-bold text-navy small d-block">${k.imie}</span><small class="text-muted">Karta ${k.nrKarty} · rotacja ${k.dataRotacji}</small></div>
               <span class="badge badge-subtle-danger">${k.dzial || '-'}</span>
             </div>`
        ).join('');
    }

    function otworzModalaKarty(id) {
        document.getElementById('k-stare-imie').value = '';
        if (id) {
            const k = BAZA_KARTY.find(x => x.id === id);
            if (k) {
                document.getElementById('modalKartaTytul').innerHTML = '<i class="fas fa-id-card me-2"></i>Edytuj kartę';
                document.getElementById('k-stare-imie').value = k.imie;
                document.getElementById('k-kadrowy').value = k.kadrowy;
                document.getElementById('k-imie').value = k.imie;
                document.getElementById('k-nrKarty').value = k.nrKarty;
                document.getElementById('k-dzial').value = k.dzial;
                document.getElementById('k-status').value = k.status;
            }
        } else {
            document.getElementById('modalKartaTytul').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Przypisz nową kartę';
            ['k-kadrowy','k-imie','k-nrKarty','k-dzial'].forEach(i => document.getElementById(i).value = '');
            document.getElementById('k-status').value = 'Wydana';
        }
        new bootstrap.Modal(document.getElementById('modalKarta')).show();
    }

    function zapiszKarte() {
        const imie = document.getElementById('k-imie').value.trim();
        const nrKarty = document.getElementById('k-nrKarty').value.trim();
        if (!imie || !nrKarty) { alert('Podaj imię i numer karty.'); return; }
        const stare = document.getElementById('k-stare-imie').value;
        const rec = {
            kadrowy: document.getElementById('k-kadrowy').value.trim(),
            imie: imie,
            nrKarty: nrKarty,
            dzial: document.getElementById('k-dzial').value.trim(),
            status: document.getElementById('k-status').value
        };
        if (stare) {
            const idx = BAZA_KARTY.findIndex(x => x.imie === stare);
            if (idx >= 0) { rec.id = BAZA_KARTY[idx].id; rec.doRozliczenia = BAZA_KARTY[idx].doRozliczenia; rec.dataRotacji = BAZA_KARTY[idx].dataRotacji; BAZA_KARTY[idx] = rec; }
            pokazPowiadomienie('Zapisano zmiany karty.');
        } else {
            rec.id = 'karta_new_' + Date.now();
            rec.doRozliczenia = false; rec.dataRotacji = '';
            BAZA_KARTY.push(rec);
            pokazPowiadomienie('Przypisano nową kartę.');
        }
        google.script.run.withSuccessHandler(()=>{}).zapiszKarteServer(rec);
        bootstrap.Modal.getInstance(document.getElementById('modalKarta'))?.hide();
        renderKartyWszystko();
    }

    function usunKarte(id) {
        const k = BAZA_KARTY.find(x => x.id === id);
        if (!k) return;
        if (!confirm(`Usunąć kartę ${k.nrKarty} (${k.imie})?`)) return;
        BAZA_KARTY = BAZA_KARTY.filter(x => x.id !== id);
        google.script.run.withSuccessHandler(()=>{}).usunKarteServer(k.kadrowy, k.imie);
        renderKartyWszystko();
        pokazPowiadomienie('Karta usunięta.');
    }

    function zarzadzajKartamiWBiurze() {
        const obecne = KARTY_WOLNE.join(', ');
        const wynik = prompt('Karty w biurze (numery po przecinku):', obecne);
        if (wynik === null) return;
        KARTY_WOLNE = wynik.split(',').map(s => s.trim()).filter(Boolean);
        google.script.run.withSuccessHandler(()=>{}).zapiszKartySzufladaServer(KARTY_WOLNE);
        renderKartyWszystko();
        pokazPowiadomienie('Zaktualizowano karty w biurze.');
    }

    // =========================================================================
    //  INICJALIZACJA
    // =========================================================================
    function initAdditionalData() {
        google.script.run.withSuccessHandler(res => {
            if(res && res.pracownicy) {
                BAZA_MIESIAC = res.pracownicy;
                populujFiltryEwidencji();
                filtrujEwidencjeMiesiaca();
                document.getElementById('ml-wszyscy').innerText = res.stats.wszyscy;
                document.getElementById('ml-nowi').innerText = res.stats.nowi;
                document.getElementById('ml-rot').innerText = res.stats.rotujacy;
            }
        }).pobierzEwidencjeMiesiaca('Czerwiec 2026');

        google.script.run.withSuccessHandler(res => {
            if(res && res.lista) {
                BAZA_KARTY = res.lista;
                renderKartyWszystko();
            }
        }).pobierzKartyServer();

        google.script.run.withSuccessHandler(res => {
            KARTY_WOLNE = res || [];
            renderWolneKarty();
        }).pobierzKartySzufladaServer();
    }

    function initUmowy() {
        initAdditionalData();
        document.getElementById('loader').style.display = 'flex';
        setTimeout(() => {
            google.script.run
                .withSuccessHandler(resUmowy => {
                    BAZA_PRACOWNIKOW = resUmowy.lista;
                    document.getElementById('stat-wszyscy').innerText = resUmowy.statystyki.wszyscy;
                    document.getElementById('stat-onboard').innerText = resUmowy.statystyki.wOnboardingu;
                    document.getElementById('stat-done').innerText = resUmowy.statystyki.wdrozeni;
                    populujFiltryRaportow();
                    filtrujBaze();
                    document.getElementById('loader').style.opacity = '0';
                    setTimeout(() => document.getElementById('loader').style.display = 'none', 300);
                })
                .pobierzBazePracownikow();
        }, 800);
    }

    function switchTab(tabName) {
      document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tabName).classList.add('active');
      ['lista','karty','umowy','raporty'].forEach(t => document.getElementById('panel-' + t).style.display = 'none');
      document.getElementById('panel-' + tabName).style.display = 'block';
      if (tabName === 'raporty') generujRaporty();
    }

    // =========================================================================
    //  ZAKŁADKA: UMOWY
    // =========================================================================
    function sortUmo(col) {
        document.getElementById('sortData').value = "";
        if(sUmo.col === col) sUmo.asc = !sUmo.asc;
        else { sUmo.col = col; sUmo.asc = true; }
        filtrujBaze();
    }

    function filtrujBaze() {
      const qImie = document.getElementById('filterImie').value.toLowerCase().trim();
      const qStatus = document.getElementById('filterStatus').value;
      const qAktualna = document.getElementById('filterAktualna').value;
      const qOnboarding = document.getElementById('filterOnboarding').value;
      const qSort = document.getElementById('sortData').value;

      let wyniki = BAZA_PRACOWNIKOW.filter(p => {
         const pasujeImie = p.imie.toLowerCase().includes(qImie);
         const pasujeStatus = qStatus === "" || p.statusAkcji.toLowerCase() === qStatus;
         const pasujeAktualna = qAktualna === "" || p.aktualnaUmowa.toLowerCase() === qAktualna;
         const pasujeOnboarding = qOnboarding === "" || p.onboarding.toLowerCase() === qOnboarding;
         return pasujeImie && pasujeStatus && pasujeAktualna && pasujeOnboarding;
      });

      if(qSort) {
          sUmo.col = "";
          wyniki.sort((a, b) => qSort === 'asc' ? a.koniecUmowyRaw - b.koniecUmowyRaw : b.koniecUmowyRaw - a.koniecUmowyRaw);
      } else if (sUmo.col) {
          wyniki.sort((a,b) => {
                let va = String(a[sUmo.col]).toLowerCase(), vb = String(b[sUmo.col]).toLowerCase();
                if(va < vb) return sUmo.asc ? -1 : 1;
                if(va > vb) return sUmo.asc ? 1 : -1;
                return 0;
          });
      }
      document.getElementById('count-umowy').innerText = wyniki.length;
      renderWierszeUmow(wyniki);
    }

    function renderWierszeUmow(lista) {
      let html = '';
      if(lista.length === 0) {
         html = `<tr><td colspan="6" class="text-center text-muted py-5"><i class="fas fa-folder-open mb-3 fs-1 opacity-25"></i><br><h5>Brak wyników spełniających kryteria.</h5></td></tr>`;
      }

      lista.forEach((p) => {
        let badgeOnboard = 'badge-subtle-success';
        let ob = p.onboarding.toLowerCase();
        if (ob.includes("przed")) badgeOnboard = 'badge-subtle-danger';
        else if (ob.includes("po 1")) badgeOnboard = 'badge-subtle-warning';
        else if (ob.includes("po 2")) badgeOnboard = 'badge-subtle-purple';

        let badgeAkcja = `<span class="badge badge-solid-green"><i class="fas fa-check-circle me-1"></i>${p.statusAkcji.toUpperCase()}</span>`;
        if (p.statusAkcji === "Wystawić") badgeAkcja = `<span class="badge badge-solid-red"><i class="fas fa-exclamation-circle me-1"></i>WYSTAWIĆ</span>`;
        const wKolejce = window.umowyKolejka[p.imie] !== undefined;
        if (wKolejce) badgeAkcja = `<span class="badge badge-solid-blue"><i class="fas fa-check me-1"></i>W KOSZYKU</span>`;

        let btnZapiszHtml = `<button id="btn_zapisz_${p.id}" class="btn py-3 w-100 fw-bold shadow-sm" style="background-color: var(--rd-blue); color: white;" onclick="dodajDoKolejki('${p.imie}', '${p.id}')"><i class="fas fa-plus-circle me-2"></i>Dodaj do wystawienia</button>`;
        if (wKolejce) btnZapiszHtml = `<button class="btn py-3 w-100 fw-bold shadow-sm" style="background-color: #16a34a; color: white;" disabled><i class="fas fa-check me-2"></i>W koszyku</button>`;

        const initials = getInitials(p.imie);
        let isExpanded = window.lastExpandedUmowa === p.id;
        let rowClass = isExpanded ? 'bg-light' : '';

        let propColor = "#3b82f6";
        if (p.propozycja === "Tygodniowa" && (p.l4 > 0 || p.nn > 0)) propColor = "#ef4444";
        if (p.propozycja === "Miesięczna") propColor = "#10b981";

        html += `
          <tr class="main-row table-row-cursor ${rowClass}" onclick="window.lastExpandedUmowa = window.lastExpandedUmowa === '${p.id}' ? null : '${p.id}'; filtrujBaze();">
            <td class="ps-4">
                <div class="d-flex align-items-center">
                    <div class="avatar-small me-3">${initials}</div>
                    <span class="fw-bold text-navy fs-6">${p.imie}</span>
                </div>
            </td>
            <td class="fw-bold text-secondary">${p.aktualnaUmowa}</td>
            <td><span class="badge ${badgeOnboard}">${p.onboarding}</span></td>
            <td class="text-secondary fw-bold"><i class="far fa-calendar-alt me-2"></i>${p.okresUmowy}</td>
            <td class="text-center" id="badge_td_${p.id}">${badgeAkcja}</td>
            <td class="text-end pe-4"><i class="fas fa-chevron-${isExpanded ? 'up text-primary' : 'down text-secondary'} fs-5"></i></td>
          </tr>
        `;

        if (isExpanded) {
        const histRows = (p.historia && p.historia.length)
            ? p.historia.map(h => `<div class="clean-list-item"><span class="text-muted">${h.typ}</span><span class="fw-bold text-navy">${h.od} – ${h.do}</span></div>`).join('')
            : '<span class="text-muted small fst-italic">Brak wcześniejszych umów.</span>';
        html += `
          <tr class="details-row">
            <td colspan="6" class="p-0 border-0">
              <div class="details-panel">
                <div class="row g-4">

                  <div class="col-md-4">
                    <div class="detail-box">
                      <h6 class="text-navy fw-bold border-bottom mb-4 pb-3"><i class="fas fa-chart-line text-primary me-2"></i>Dane Frekwencyjne</h6>
                      <div class="clean-list-item"><span class="text-muted">Start umowy:</span><span class="fw-bold text-navy">${p.dataRozpoczecia}</span></div>
                      <div class="clean-list-item"><span class="text-muted">Godziny pracy:</span><span class="fw-bold text-primary">${p.godziny} h</span></div>
                      <div class="clean-list-item"><span class="text-muted">Przeliczone dni:</span><span class="fw-bold text-navy">${p.dni} dni</span></div>
                      <div class="clean-list-item" style="border-bottom-color: #fee2e2;"><span class="text-muted">Zwolnienie L4:</span><span class="fw-bold text-danger">${p.l4} dni</span></div>
                      <div class="clean-list-item mb-4"><span class="text-muted">Nieobecności NN:</span><span class="fw-bold text-danger">${p.nn} dni</span></div>

                      <div class="mt-4 pt-3 border-top">
                         <label class="small text-muted fw-bold mb-2">Zmień etap wdrożenia:</label>
                         <div class="input-group">
                            <select class="form-select bg-light border-end-0 fw-bold text-navy" id="zmien_onboarding_${p.id}">
                               <option value="Przed spotkaniem" ${ob.includes('przed') ? 'selected' : ''}>Przed spotkaniem</option>
                               <option value="Po 1 spotkaniu" ${ob.includes('po 1') ? 'selected' : ''}>Po 1 spotkaniu</option>
                               <option value="Po 2 spotkaniu" ${ob.includes('po 2') ? 'selected' : ''}>Po 2 spotkaniu</option>
                               <option value="Nie dotyczy" ${ob.includes('nie dotyczy') || ob === '-' ? 'selected' : ''}>Nie dotyczy</option>
                            </select>
                            <button class="btn border border-start-0 bg-white text-primary" title="Zapisz" onclick="zapiszOnboarding('${p.id}')"><i class="fas fa-save"></i></button>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="detail-box d-flex flex-column">
                      <h6 class="text-navy fw-bold border-bottom mb-3 pb-3"><i class="fas fa-history text-primary me-2"></i>Historia umów</h6>
                      <div class="flex-grow-1">
                        ${histRows}
                      </div>
                      <div class="notatki-box mt-3 pt-3 border-top">
                         <label class="small fw-bold text-muted mb-2">Notatka zespołu</label>
                         <div class="input-group shadow-sm rounded-3">
                            <input type="text" class="form-control bg-light border-end-0" id="notatka_${p.id}" placeholder="Szybka notatka...">
                            <button class="btn text-white" style="background-color: var(--rd-navy);" onclick="zapiszNotatke('${p.id}')"><i class="fas fa-paper-plane"></i></button>
                         </div>
                         ${p.notatki ? `<div class="p-2 mt-2 bg-light rounded-3 border small text-secondary">${p.notatki}</div>` : ''}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <div class="detail-box shadow-sm d-flex flex-column justify-content-between p-0 overflow-hidden" style="border: 2px solid var(--rd-navy);">
                      <div class="p-4" style="background-color: var(--rd-navy); color: white;">
                         <h6 class="mb-3 text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px; color: rgba(255,255,255,0.65);">Rekomendowany Okres</h6>
                         <h2 class="mb-1" style="color: ${propColor}; font-weight: 900; font-size: 2rem;">${p.propozycja}</h2>
                         ${p.l4 > 0 || p.nn > 0 ? '<small class="text-warning d-block mt-2"><i class="fas fa-shield-alt me-1"></i>Ryzyko obniżenia na podstawie frekwencji</small>' : '<div class="mt-2 mb-1"></div>'}
                      </div>
                      <div class="p-4 bg-white">
                         <h6 class="text-muted mb-3 fw-bold" style="font-size: 0.8rem;">Rewizja nowego okresu:</h6>
                         <div class="row g-2 mb-4">
                            <div class="col-6"><label class="small text-muted fw-bold mb-1">Od kiedy</label><input type="date" id="nowa_od_${p.id}" class="form-control fw-bold" ${wKolejce ? `value="${window.umowyKolejka[p.imie].od}" disabled` : `value="${p.trwajacaDo}"`}></div>
                            <div class="col-6"><label class="small text-muted fw-bold mb-1">Do kiedy</label><input type="date" id="nowa_do_${p.id}" class="form-control fw-bold" ${wKolejce ? `value="${window.umowyKolejka[p.imie].do}" disabled` : ''}></div>
                         </div>
                         ${btnZapiszHtml}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </td>
          </tr>
        `;
        }
      });
      document.getElementById('tabela-cialo').innerHTML = html;
    }

    function zapiszOnboarding(id) {
        const p = BAZA_PRACOWNIKOW.find(x => x.id === id);
        const sel = document.getElementById('zmien_onboarding_' + id);
        if (!p || !sel) return;
        p.onboarding = sel.value;
        google.script.run.withSuccessHandler(()=>{}).zmienStatusOnboardinguServer(p.imie, sel.value);
        pokazPowiadomienie('Zapisano etap wdrożenia.');
        filtrujBaze();
    }

    function zapiszNotatke(id) {
        const p = BAZA_PRACOWNIKOW.find(x => x.id === id);
        const inp = document.getElementById('notatka_' + id);
        if (!p || !inp || !inp.value.trim()) return;
        p.notatki = inp.value.trim();
        google.script.run.withSuccessHandler(()=>{}).dodajNotatkeUmowyServer(p.imie, p.notatki);
        pokazPowiadomienie('Dodano notatkę.');
        filtrujBaze();
    }

    // =========================================================================
    //  KOSZYK / WYSTAWIANIE
    // =========================================================================
    function pokazKoszyk() {
        let html = '';
        const keys = Object.keys(window.umowyKolejka);
        if(keys.length === 0) {
            html = '<tr><td colspan="4" class="text-center text-muted py-5"><i class="fas fa-box-open fs-1 mb-3 text-secondary opacity-50"></i><br><h5 class="fw-bold">Koszyk jest pusty</h5><p>Dodaj umowy z tabeli głównej.</p></td></tr>';
        } else {
            keys.forEach(imie => {
                const u = window.umowyKolejka[imie];
                html += `<tr>
                    <td class="fw-bold text-navy ps-4">${imie}</td>
                    <td class="fw-bold text-secondary">${u.od.split('-').reverse().join('.')}</td>
                    <td class="fw-bold text-secondary">${u.do.split('-').reverse().join('.')}</td>
                    <td class="text-end pe-4"><button class="btn btn-sm btn-outline-danger" onclick="usunZKoszyka('${imie}')"><i class="fas fa-trash"></i></button></td>
                </tr>`;
            });
        }
        document.getElementById('koszyk-cialo').innerHTML = html;
        new bootstrap.Modal(document.getElementById('modalKoszyk')).show();
    }

    function usunZKoszyka(imie) {
        delete window.umowyKolejka[imie];
        pokazKoszyk();
        document.getElementById('licznik-umow').innerText = Object.keys(window.umowyKolejka).length;
        filtrujBaze();
    }

    function dodajDoKolejki(imie, idStr) {
      const dOd = document.getElementById('nowa_od_' + idStr);
      const dDo = document.getElementById('nowa_do_' + idStr);
      if(!dOd.value || !dDo.value) { alert("Uzupełnij daty rozpoczęcia i zakończenia umowy."); return; }
      window.umowyKolejka[imie] = { od: dOd.value, do: dDo.value };
      dOd.disabled = true; dDo.disabled = true;
      document.getElementById('licznik-umow').innerText = Object.keys(window.umowyKolejka).length;
      pokazPowiadomienie(`Dodano ${imie} do koszyka.`);
      filtrujBaze();
    }

    function uruchomSynchronizacje() {
      pokazPowiadomienie("Trwa przeliczanie umów i dat...", false);
      google.script.run
          .withSuccessHandler(msg => {
                pokazPowiadomienie(msg);
                google.script.run.withSuccessHandler(res => {
                    BAZA_PRACOWNIKOW = res.lista;
                    window.lastExpandedUmowa = null;
                    filtrujBaze();
                }).pobierzBazePracownikow();
          })
          .synchronizujPelnySystemServer();
    }

    function uruchomWystawianie() {
      const ile = Object.keys(window.umowyKolejka).length;
      if (ile === 0) { alert("Koszyk jest pusty – brak umów do wystawienia."); return; }
      pokazPowiadomienie(`Wystawianie ${ile} umów i aktualizacja bazy...`);
      google.script.run
          .withSuccessHandler(msg => {
               window.umowyKolejka = {};
               document.getElementById('licznik-umow').innerText = '0';
               pokazPowiadomienie(msg);
               google.script.run.withSuccessHandler(res => {
                    BAZA_PRACOWNIKOW = res.lista;
                    window.lastExpandedUmowa = null;
                    bootstrap.Modal.getInstance(document.getElementById('modalKoszyk'))?.hide();
                    filtrujBaze();
               }).pobierzBazePracownikow();
          })
          .wystawZbiorczoIGenerujTydzienServer(window.umowyKolejka);
    }

    function uruchomDodawanieDoAktualnego() {
      const ile = Object.keys(window.umowyKolejka).length;
      if (ile === 0) { alert("Koszyk jest pusty."); return; }
      pokazPowiadomienie(`Dodano ${ile} umów do trwającego tygodnia.`);
      google.script.run.withSuccessHandler(msg => {
          window.umowyKolejka = {};
          document.getElementById('licznik-umow').innerText = '0';
          filtrujBaze();
      }).dodajZbiorczoDoAktualnegoTygodniaServer(window.umowyKolejka);
    }

    function uruchomAktualizacjeRaportu() {
      const file = document.getElementById('raportFile').files[0];
      if (!file) { alert("Wybierz plik raportu (CSV/XLSX)."); return; }
      pokazPowiadomienie("Wczytywanie raportu absencji...");
      google.script.run.withSuccessHandler(msg => {
          pokazPowiadomienie(msg || "Raport wczytany.");
          google.script.run.withSuccessHandler(res => { BAZA_PRACOWNIKOW = res.lista; filtrujBaze(); }).pobierzBazePracownikow();
      }).wgrajRaportIAktualizuj({ nazwa: file.name });
    }

    // stuby selektora miesiąca (ukryty w tej wersji)
    function zmienMiesiac() {}
    function dodajNowyMiesiac() {}

    // =========================================================================
    //  ZAKŁADKA: RAPORTY (wykresy)
    // =========================================================================
    window._charts = {};
    function nazwaDoDzial(imie) {
        const k = BAZA_KARTY.find(x => x.imie === imie) || BAZA_MIESIAC.find(x => x.imie === imie);
        return k ? k.dzial : 'Inne';
    }

    function populujFiltryRaportow() {
        const dzialy = [...new Set(BAZA_KARTY.map(k => k.dzial).filter(Boolean))].sort();
        [['filtUmowy','Wszystkie działy'], ['filtOnboarding','Wszystkie działy'], ['filtAbsDzial','Wszystkie Działy']].forEach(([id, label]) => {
            const sel = document.getElementById(id);
            if (sel) { sel.innerHTML = `<option value="${id==='filtAbsDzial'?'ALL':''}">${label}</option>`; dzialy.forEach(d => sel.add(new Option(d, d))); }
        });
        const pSel = document.getElementById('filtAbsPracownik');
        if (pSel) { pSel.innerHTML = '<option value="ALL">Wszyscy Pracownicy</option>'; BAZA_PRACOWNIKOW.forEach(p => pSel.add(new Option(p.imie, p.imie))); }
    }

    function rysujWykres(id, type, labels, dane, kolory, opcje) {
        const cv = document.getElementById(id);
        if (!cv || typeof Chart === 'undefined') return;
        if (window._charts[id]) window._charts[id].destroy();
        window._charts[id] = new Chart(cv.getContext('2d'), {
            type: type,
            data: { labels: labels, datasets: [{ data: dane, backgroundColor: kolory, borderWidth: type==='bar'?0:2, borderColor:'#fff' }] },
            options: Object.assign({ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: type==='bar'?'top':'bottom' } } }, opcje || {})
        });
    }

    function generujRaporty() {
        if (typeof Chart === 'undefined' || !BAZA_PRACOWNIKOW.length) return;
        const PAL = ['#005A9C','#0090D4','#10b981','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#64748b'];

        // 1. Umowy (typy aktualnej umowy)
        const fU = document.getElementById('filtUmowy').value;
        const umowy = {};
        BAZA_PRACOWNIKOW.forEach(p => {
            if (fU && nazwaDoDzial(p.imie) !== fU) return;
            const t = p.aktualnaUmowa || 'Brak';
            umowy[t] = (umowy[t]||0) + 1;
        });
        rysujWykres('wykresUmowy', 'doughnut', Object.keys(umowy), Object.values(umowy), PAL);

        // 2. Onboarding
        const fO = document.getElementById('filtOnboarding').value;
        const onb = {};
        BAZA_PRACOWNIKOW.forEach(p => {
            if (fO && nazwaDoDzial(p.imie) !== fO) return;
            const t = p.onboarding || 'Nie dotyczy';
            onb[t] = (onb[t]||0) + 1;
        });
        rysujWykres('wykresOnboarding', 'doughnut', Object.keys(onb), Object.values(onb), PAL);

        // 3. Działy (z ewidencji wg statusu)
        const fD = document.getElementById('filtDzialy').value;
        const dz = {};
        BAZA_MIESIAC.forEach(p => {
            const st = rotacjaStatus(p.dataRotacji);
            let ok = true;
            if (fD === 'Obecni') ok = st !== 'Zakończono';
            else if (fD === 'Aktywny') ok = st === 'Aktywny';
            else if (fD === 'Rotuje') ok = st === 'Rotuje';
            else if (fD === 'Zakończono') ok = st === 'Zakończono';
            if (!ok) return;
            const d = p.dzial || 'Inne';
            dz[d] = (dz[d]||0) + 1;
        });
        rysujWykres('wykresDzialy', 'bar', Object.keys(dz), Object.values(dz), '#0090D4', { plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true,ticks:{precision:0}}} });

        // 4. Absencje (L4 + NN)
        const fAD = document.getElementById('filtAbsDzial').value;
        const fAP = document.getElementById('filtAbsPracownik').value;
        let abs = BAZA_PRACOWNIKOW.filter(p => (p.l4 > 0 || p.nn > 0));
        if (fAP && fAP !== 'ALL') abs = abs.filter(p => p.imie === fAP);
        else if (fAD && fAD !== 'ALL') abs = abs.filter(p => nazwaDoDzial(p.imie) === fAD);
        abs = abs.sort((a,b) => (b.l4+b.nn)-(a.l4+a.nn)).slice(0, 12);
        const cv = document.getElementById('wykresAbsencje');
        if (cv && typeof Chart !== 'undefined') {
            if (window._charts['wykresAbsencje']) window._charts['wykresAbsencje'].destroy();
            window._charts['wykresAbsencje'] = new Chart(cv.getContext('2d'), {
                type: 'bar',
                data: { labels: abs.map(p => p.imie), datasets: [
                    { label: 'L4 (dni)', data: abs.map(p => p.l4), backgroundColor: '#f59e0b' },
                    { label: 'NN (dni)', data: abs.map(p => p.nn), backgroundColor: '#ef4444' }
                ]},
                options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top'}}, scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true,ticks:{precision:0}}} }
            });
            if (!abs.length) {
                const ctx = cv.getContext('2d');
                ctx.font = '14px Segoe UI'; ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center';
                ctx.fillText('Brak zarejestrowanych absencji dla wybranych filtrów.', cv.width/2, 60);
            }
        }
    }

    // EXPORTS
    window.initUmowy = initUmowy;
    window.pokazPowiadomienie = pokazPowiadomienie;
    window.switchTab = switchTab;
    window.getInitials = getInitials;
    window.wybierzPracownika = wybierzPracownika;
    window.filtrujEwidencjeMiesiaca = filtrujEwidencjeMiesiaca;
    window.sortEwi = sortEwi;
    window.otworzDodawanie = otworzDodawanie;
    window.otworzEdycje = otworzEdycje;
    window.zapiszPracownika = zapiszPracownika;
    window.usunPracownika = usunPracownika;
    window.zapiszRotacjeZPanelu = zapiszRotacjeZPanelu;
    window.oznaczKarteJakoZwrocona = oznaczKarteJakoZwrocona;
    window.filtrujKarty = filtrujKarty;
    window.sortKar = sortKar;
    window.otworzModalaKarty = otworzModalaKarty;
    window.zapiszKarte = zapiszKarte;
    window.usunKarte = usunKarte;
    window.zarzadzajKartamiWBiurze = zarzadzajKartamiWBiurze;
    window.sortUmo = sortUmo;
    window.filtrujBaze = filtrujBaze;
    window.zapiszOnboarding = zapiszOnboarding;
    window.zapiszNotatke = zapiszNotatke;
    window.pokazKoszyk = pokazKoszyk;
    window.usunZKoszyka = usunZKoszyka;
    window.dodajDoKolejki = dodajDoKolejki;
    window.uruchomSynchronizacje = uruchomSynchronizacje;
    window.uruchomWystawianie = uruchomWystawianie;
    window.uruchomDodawanieDoAktualnego = uruchomDodawanieDoAktualnego;
    window.uruchomAktualizacjeRaportu = uruchomAktualizacjeRaportu;
    window.generujRaporty = generujRaporty;
    window.zmienMiesiac = zmienMiesiac;
    window.dodajNowyMiesiac = dodajNowyMiesiac;
