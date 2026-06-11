
    var BAZA_PRACOWNIKOW = [];
   
    let sUmo = { col: '', asc: true };
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
        box.style.backgroundColor = isError ? 'var(--rd-danger)' : 'var(--rd-success)';
        box.style.display = 'block';
       
        clearTimeout(alertTimeout);
        if(!isError) {
            alertTimeout = setTimeout(() => { box.style.display = 'none'; }, 3000);
        }
    }

    
    let BAZA_MIESIAC = [];
    let BAZA_KARTY = [];

    function renderEwidencjaMiesiaca(lista) {
        let html = '';
        lista.forEach(p => {
            html += `<tr class="table-row-cursor">
              <td class="ps-4 fw-bold text-navy">${p.imie}</td>
              <td>${p.sap}</td>
              <td>${p.dzial}</td>
              <td>${p.dataStartuFormat}</td>
              <td>${p.telefon || '-'}</td>
              <td class="text-end pe-4"><span class="badge badge-solid-green">Aktualna</span></td>
            </tr>`;
        });
        document.getElementById('tabela-miesiac-cialo').innerHTML = html;
    }

    function renderKarty(lista) {
        let html = '';
        lista.forEach(p => {
            html += `<tr>
              <td class="ps-4 fw-bold text-navy">${p.kadrowy}</td>
              <td>${p.imie}</td>
              <td>${p.nrKarty}</td>
              <td>${p.dzial}</td>
              <td><span class="badge ${p.status === 'Wydana' ? 'badge-solid-blue' : 'badge-solid-green'}">${p.status}</span></td>
              <td class="text-end pe-4"><button class="btn btn-sm btn-outline-primary">Edytuj</button></td>
            </tr>`;
        });
        document.getElementById('tabela-karty-cialo').innerHTML = html;
    }

    function initAdditionalData() {
        google.script.run.withSuccessHandler(res => {
            if(res && res.pracownicy) {
                renderEwidencjaMiesiaca(res.pracownicy);
                document.getElementById('ml-wszyscy').innerText = res.stats.wszyscy;
                document.getElementById('ml-nowi').innerText = res.stats.nowi;
                document.getElementById('ml-rot').innerText = res.stats.rotujacy;
            }
        }).pobierzEwidencjeMiesiaca('Czerwiec 2026');

        google.script.run.withSuccessHandler(res => {
            if(res && res.lista) {
                renderKarty(res.lista);
                document.getElementById('k-wydane').innerText = res.stats.wydane;
                document.getElementById('k-rozliczenie').innerText = res.stats.doRozliczenia || 0;
                document.getElementById('k-oddane').innerText = res.stats.oddane || 0;
            }
        }).pobierzKartyServer();
    }

    function initUmowy() {
        initAdditionalData();
        initAdditionalData();
        document.getElementById('loader').style.display = 'flex';
        setTimeout(() => {
            google.script.run
                .withSuccessHandler(resUmowy => {
                    BAZA_PRACOWNIKOW = resUmowy.lista;
                    document.getElementById('stat-wszyscy').innerText = resUmowy.statystyki.wszyscy;
                    document.getElementById('stat-onboard').innerText = resUmowy.statystyki.wOnboardingu;
                    document.getElementById('stat-done').innerText = resUmowy.statystyki.wdrozeni;
                    filtrujBaze();
                    document.getElementById('loader').style.opacity = '0';
                    setTimeout(() => document.getElementById('loader').style.display = 'none', 300);
                })
                .pobierzBazePracownikow();
        }, 1000);
    };

    function switchTab(tabName) {
      document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tabName).classList.add('active');
     
      document.getElementById('panel-lista').style.display = 'none';
      document.getElementById('panel-karty').style.display = 'none';
      document.getElementById('panel-umowy').style.display = 'none';
      document.getElementById('panel-raporty').style.display = 'none';
      document.getElementById('panel-' + tabName).style.display = 'block';
    }

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
          wyniki.sort((a, b) => {
              if (qSort === 'asc') return a.koniecUmowyRaw - b.koniecUmowyRaw;
              else return b.koniecUmowyRaw - a.koniecUmowyRaw;
          });
      } else if (sUmo.col) {
          wyniki.sort((a,b) => {
                let va = String(a[sUmo.col]).toLowerCase();
                let vb = String(b[sUmo.col]).toLowerCase();
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
     
      lista.forEach((p, index) => {
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
        if (wKolejce) btnZapiszHtml = `<button id="btn_zapisz_${p.id}" class="btn py-3 w-100 fw-bold shadow-sm" style="background-color: var(--rd-success); color: white;" disabled><i class="fas fa-check me-2"></i>W koszyku</button>`;

        const initials = getInitials(p.imie);
        let isExpanded = window.lastExpandedUmowa === p.id;
        let collapseClass = isExpanded ? 'show' : '';
        let rowClass = isExpanded ? 'bg-light' : '';

        // Dynamiczna propozycja
        let propColor = "#3b82f6"; // blue
        if (p.propozycja === "Tygodniowa" && (p.l4 > 0 || p.nn > 0)) propColor = "#ef4444"; // red text logic applied
        if (p.propozycja === "Miesięczna") propColor = "#10b981"; // green

        html += `
          <tr class="main-row table-row-cursor ${rowClass}" onclick="window.lastExpandedUmowa = window.lastExpandedUmowa === '${p.id}' ? null : '${p.id}'; filtrujBaze();">
            <td class="ps-4">
                <div class="d-flex align-items-center">
                    <div class="avatar-small me-3">${initials}</div>
                    <span class="fw-bold text-navy fs-6">${p.imie}</span>
                </div>
            </td>
            <td class="fw-bold text-slate-500">${p.aktualnaUmowa}</td>
            <td><span class="badge ${badgeOnboard}">${p.onboarding}</span></td>
            <td class="text-slate-500 fw-bold"><i class="far fa-calendar-alt me-2"></i>${p.okresUmowy}</td>
            <td class="text-center" id="badge_td_${p.id}">${badgeAkcja}</td>
            <td class="text-end pe-4"><i class="fas fa-chevron-${isExpanded ? 'up text-primary' : 'down text-slate-300'} fs-5"></i></td>
          </tr>
        `;
        
        if (isExpanded) {
        html += `
          <tr class="details-row">
            <td colspan="6" class="p-0 border-0">
              <div id="${p.id}" class="collapse show">
                <div class="details-panel">
                  <div class="row g-4">
                   
                    <div class="col-md-4">
                      <div class="detail-box">
                        <h6 class="text-navy fw-bold border-bottom mb-4 pb-3"><i class="fas fa-chart-line text-blue-500 me-2"></i>Dane Frekwencyjne</h6>
                        <div class="clean-list-item"><span class="text-muted">Start Umowy:</span><span class="fw-bold text-navy">${p.dataRozpoczecia}</span></div>
                        <div class="clean-list-item"><span class="text-muted">Godziny pracy:</span><span class="fw-bold text-primary">${p.godziny} h</span></div>
                        <div class="clean-list-item"><span class="text-muted">Przeliczone Dni:</span><span class="fw-bold text-navy">${p.dni} d</span></div>
                        <div class="clean-list-item" style="border-bottom-color: #fee2e2;"><span class="text-muted">Zwolnienie L4:</span><span class="fw-bold text-danger">${p.l4} days</span></div>
                        <div class="clean-list-item mb-4"><span class="text-muted">Nieobecne NN:</span><span class="fw-bold text-danger">${p.nn} days</span></div>
                       
                        <div class="mt-4 pt-3 border-top">
                           <label class="small text-muted fw-bold mb-2">Zmień etap wdrożenia:</label>
                           <div class="input-group">
                              <select class="form-select bg-light border-end-0 fw-bold text-navy" id="zmien_onboarding_${p.id}">
                                 <option value="Przed spotkaniem" ${ob.includes('przed') ? 'selected' : ''}>Przed spotkaniem</option>
                                 <option value="Po 1 spotkaniu" ${ob.includes('po 1') ? 'selected' : ''}>Po 1 spotkaniu</option>
                                 <option value="Po 2 spotkaniu" ${ob.includes('po 2') ? 'selected' : ''}>Po 2 spotkaniu</option>
                                 <option value="Nie dotyczy" ${ob.includes('nie dotyczy') || ob === '-' ? 'selected' : ''}>N/A</option>
                              </select>
                              <button class="btn border border-start-0 bg-white text-primary" title="Zapisz" onclick="pokazPowiadomienie('Status saved')"><i class="fas fa-save"></i></button>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-4">
                      <div class="detail-box d-flex flex-column">
                        <h6 class="text-navy fw-bold border-bottom mb-3 pb-3"><i class="fas fa-history text-blue-500 me-2"></i>History & Context</h6>
                        <div class="notatki-box flex-grow-1">
                           <label class="small fw-bold text-muted mb-2">Notatki od zespołu</label>
                           <div class="input-group mb-3 shadow-sm rounded-3">
                              <input type="text" class="form-control bg-light border-end-0" placeholder="Szybka notatka...">
                              <button class="btn text-white" style="background-color: var(--rd-navy);" onclick="pokazPowiadomienie('Note appended')"><i class="fas fa-paper-plane"></i></button>
                           </div>
                           <div class="p-3 bg-light rounded-3 border">
                              ${p.notatki ? `<span class="fw-bold text-navy d-block small mb-1"><i class="fas fa-user-circle me-1 text-primary"></i>Systemowy użytkownik</span><span class="text-slate-600 small">${p.notatki}</span>` : '<span class="text-muted small fst-italic">Brak historii notatek.</span>'}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-4">
                      <div class="detail-box shadow-sm d-flex flex-column justify-content-between p-0 overflow-hidden" style="border: 2px solid var(--rd-navy);">
                        <div class="p-4" style="background-color: var(--rd-navy); color: white;">
                           <h6 class="text-slate-400 mb-3 text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">Rekomendowany Okres Przez Silnik</h6>
                           <h2 class="fw-black mb-1" style="color: ${propColor}; font-weight: 900; font-size: 2rem;">${p.propozycja}</h2>
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
              </div>
            </td>
          </tr>
        `;
        }
      });
      document.getElementById('tabela-cialo').innerHTML = html;
    }

    function pokazKoszyk() {
        let html = '';
        const keys = Object.keys(window.umowyKolejka);
        if(keys.length === 0) {
            html = '<tr><td colspan="4" class="text-center text-muted py-5"><i class="fas fa-box-open fs-1 mb-3 text-slate-300"></i><br><h5 class="fw-bold">Koszyk jest pusty</h5><p>Dodaj umowy z tabeli głównej.</p></td></tr>';
        } else {
            keys.forEach(imie => {
                const u = window.umowyKolejka[imie];
                html += `<tr>
                    <td class="fw-bold text-navy ps-4">${imie}</td>
                    <td class="fw-bold text-slate-600">${u.od.split('-').reverse().join('.')}</td>
                    <td class="fw-bold text-slate-600">${u.do.split('-').reverse().join('.')}</td>
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
      if(!dOd.value || !dDo.value) { alert("Start and End dates are required!"); return; }
     
      window.umowyKolejka[imie] = { od: dOd.value, do: dDo.value };
      dOd.disabled = true; dDo.disabled = true;
      document.getElementById('licznik-umow').innerText = Object.keys(window.umowyKolejka).length;
      filtrujBaze();
    }

    function uruchomSynchronizacje() {
      pokazPowiadomienie("Decision Engine running calculations...", false);
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
      if (ile === 0) { alert("No contracts in the batch!"); return; }
      pokazPowiadomienie(`Generating ${ile} PDF contracts and updating database...`);
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
  
window.initUmowy = initUmowy;
window.pokazPowiadomienie = pokazPowiadomienie;
window.switchTab = switchTab;
window.getInitials = getInitials;
