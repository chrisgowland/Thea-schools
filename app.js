(() => {
  const data = window.SCHOOL_DATA;
  const schools = [...data.schools].sort((a, b) => a.distance_miles - b.distance_miles);

  const sportsFacilities = [
    {
      name: "Yorebridge Sport & Leisure (Askrigg)",
      approxDistance: "about 5.4 miles",
      offer: "Gym, classes, MUGA for tennis/football, studio",
      fit: "Strong for regular after-school activity in Upper Wensleydale",
      link: "https://www.yorebridgesportandleisure.co.uk/"
    },
    {
      name: "Bedale Leisure and Wellbeing Hub",
      approxDistance: "about 14.7 miles",
      offer: "25m pool, gym, sauna, sports sessions",
      fit: "Good swimming pathway and weekend family sessions",
      link: "https://www.northyorks.gov.uk/active-north-yorkshire/active-north-yorkshire-venues/bedale-leisure-and-wellbeing-hub"
    },
    {
      name: "Richmond Leisure and Wellbeing Hub",
      approxDistance: "about 11.5 miles",
      offer: "Family swim, lessons, inclusive sessions",
      fit: "Useful for learn-to-swim and school-holiday activity",
      link: "https://www.northyorks.gov.uk/active-north-yorkshire/active-north-yorkshire-venues/richmond-leisure-and-wellbeing-hub/swimming-richmond-leisure-and-wellbeing-hub"
    },
    {
      name: "Catterick Leisure Centre",
      approxDistance: "about 11 miles",
      offer: "3 pools, sports hall, gym, classes",
      fit: "Broad programme if you want one location for multiple sports",
      link: "https://catterickleisurecentre.co.uk/"
    },
    {
      name: "Wensleydale RUFC (Leyburn)",
      approxDistance: "about 5.3 miles",
      offer: "Mini and junior rugby pathways",
      fit: "Community club route for team sport development",
      link: "https://wrufc.co.uk/"
    }
  ];

  const gradeClass = {
    "Outstanding": "outstanding",
    "Good": "good",
    "Requires Improvement": "ri",
    "Inadequate": "inadequate",
    "Not found": "unknown"
  };

  const gradeOrder = ["Outstanding", "Good", "Requires Improvement", "Inadequate", "Not found"];

  const byId = id => document.getElementById(id);
  const summaryEl = byId("summary");
  const heroMeta = byId("heroMeta");
  const schoolCards = byId("schoolCards");
  const sportsCards = byId("sportsCards");
  const resultCount = byId("resultCount");
  const searchInput = byId("searchInput");
  const gradeFilter = byId("gradeFilter");
  const distanceFilter = byId("distanceFilter");

  function fmtMiles(n) {
    return `${n.toFixed(2)} miles`;
  }

  function safeUrl(url) {
    if (!url || url === "Not listed") return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  }

  function renderSummary() {
    const grades = schools.reduce((acc, s) => {
      acc[s.ofsted_grade] = (acc[s.ofsted_grade] || 0) + 1;
      return acc;
    }, {});

    heroMeta.innerHTML = `
      <span class="badge">Postcode: ${data.postcode}</span>
      <span class="badge">Primary schools in 20 miles: ${data.total_primary_within_20_miles}</span>
      <span class="badge">Data date: 28 February 2026</span>
    `;

    summaryEl.innerHTML = `
      <h2>Quick View</h2>
      <div class="summary-grid">
        <div class="kpi"><span>${data.total_primary_within_20_miles}</span>Total options</div>
        <div class="kpi"><span>${grades["Outstanding"] || 0}</span>Outstanding</div>
        <div class="kpi"><span>${grades["Good"] || 0}</span>Good</div>
        <div class="kpi"><span>${grades["Requires Improvement"] || 0}</span>Requires Improvement</div>
        <div class="kpi"><span>${grades["Inadequate"] || 0}</span>Inadequate</div>
      </div>
    `;
  }

  function schoolCard(s) {
    const website = safeUrl(s.website);
    return `
      <article class="card">
        <h3>${s.name}</h3>
        <div class="meta-row">
          <span class="tag ${gradeClass[s.ofsted_grade] || "unknown"}">${s.ofsted_grade}</span>
          <span class="tag unknown">${fmtMiles(s.distance_miles)}</span>
          <span class="tag unknown">Drive: ~${s.travel.drive_mins_est} min</span>
        </div>
        <p><strong>Location:</strong> ${s.town}, ${s.postcode}</p>
        <p><strong>Latest inspection published:</strong> ${s.latest_inspection_published}</p>
        <p><strong>Social media:</strong> ${s.social_media}</p>
        <p><strong>Travel:</strong> ${s.travel.walkCycle}; ${s.travel.publicTransport}</p>
        <p class="links">
          <a href="${s.ofsted_url}" target="_blank" rel="noopener">Ofsted report</a>
          ${website ? `<a href="${website}" target="_blank" rel="noopener">School website</a>` : ""}
        </p>
      </article>
    `;
  }

  function renderSchools() {
    const text = searchInput.value.trim().toLowerCase();
    const grade = gradeFilter.value;
    const maxDistance = Number(distanceFilter.value);

    const filtered = schools
      .filter(s => s.distance_miles <= maxDistance)
      .filter(s => grade === "all" ? true : s.ofsted_grade === grade)
      .filter(s => {
        if (!text) return true;
        return s.name.toLowerCase().includes(text) || s.town.toLowerCase().includes(text);
      })
      .sort((a, b) => {
        const ga = gradeOrder.indexOf(a.ofsted_grade);
        const gb = gradeOrder.indexOf(b.ofsted_grade);
        if (ga !== gb) return ga - gb;
        return a.distance_miles - b.distance_miles;
      });

    resultCount.textContent = `Showing ${filtered.length} school${filtered.length === 1 ? "" : "s"}.`;
    schoolCards.innerHTML = filtered.map(schoolCard).join("");
  }

  function renderSports() {
    sportsCards.innerHTML = sportsFacilities.map(f => `
      <article class="sport-card">
        <h3>${f.name}</h3>
        <p><strong>Distance:</strong> ${f.approxDistance}</p>
        <p><strong>Facilities:</strong> ${f.offer}</p>
        <p><strong>Why it matters:</strong> ${f.fit}</p>
        <p><a href="${f.link}" target="_blank" rel="noopener">View facility</a></p>
      </article>
    `).join("");
  }

  [searchInput, gradeFilter, distanceFilter].forEach(el => {
    el.addEventListener("input", renderSchools);
    el.addEventListener("change", renderSchools);
  });

  renderSummary();
  renderSports();
  renderSchools();
})();
