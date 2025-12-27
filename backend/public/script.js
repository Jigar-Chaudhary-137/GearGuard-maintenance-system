const Navigation = {
    currentPage: 'dashboard',

    init() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });

        document.querySelectorAll('.nav-item[data-page]').forEach(link => {
            link.addEventListener('click', () => {
                this.navigateTo(link.dataset.page);
                document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        document.getElementById('btn-logout').addEventListener('click', () => {
            this.showLogin();
        });
    },

    navigateTo(pageId) {
        document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
        document.getElementById(`page-${pageId}`).classList.remove('hidden');
        document.getElementById('page-title').textContent =
            pageId.replace('-', ' ').toUpperCase();
    },

    showLogin() {
        document.getElementById('app-layout').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
    },

    showApp() {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app-layout').classList.remove('hidden');
        this.navigateTo('dashboard');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();

    document.getElementById('login-form').addEventListener('submit', e => {
        e.preventDefault();
        Navigation.showApp();
    });
});
/* ===== REQUESTS DATA ===== */

const maintenanceRequests = [
  {
    id: "1",
    subject: "Fix Printer",
    description: "Paper jam",
    equipment: "Printer",
    type: "corrective",
    status: "new",
    priority: "high",
    assignedTo: "IT Team",
    date: "2025-01-05",
    dueDate: "2025-01-06"
  },
  {
    id: "2",
    subject: "CNC Maintenance",
    description: "Monthly check",
    equipment: "CNC Machine",
    type: "preventive",
    status: "in_progress",
    priority: "medium",
    assignedTo: "Mechanical Team",
    date: "2025-01-02",
    dueDate: "2025-01-03"
  },
  {
    id: "3",
    subject: "AC Repair",
    description: "Cooling issue",
    equipment: "HVAC",
    type: "corrective",
    status: "repaired",
    priority: "critical",
    assignedTo: "Electrical Team",
    date: "2024-12-28"
  }
];

/* ===== RENDER REQUESTS ===== */

function renderRequests() {
  const tbody = document.querySelector("#requestsTable tbody");
  const search = document.getElementById("requestSearch").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const type = document.getElementById("typeFilter").value;
  const empty = document.getElementById("noRequests");

  tbody.innerHTML = "";

  const filtered = maintenanceRequests.filter(r => {
    return (
      (status === "all" || r.status === status) &&
      (type === "all" || r.type === type) &&
      (r.subject.toLowerCase().includes(search) ||
       r.description.toLowerCase().includes(search))
    );
  });

  if (filtered.length === 0) {
    empty.classList.remove("hidden");
    return;
  } else {
    empty.classList.add("hidden");
  }

  filtered.forEach(r => {
    const overdue = r.dueDate && new Date(r.dueDate) < new Date() && r.status !== "repaired";

    const row = document.createElement("tr");
    if (overdue) row.style.background = "#fef2f2";

    row.innerHTML = `
      <td>${overdue ? "⚠️ " : ""}${r.subject}</td>
      <td>${r.equipment}</td>
      <td><span class="badge">${r.type}</span></td>
      <td><span class="badge">${r.status.replace("_"," ")}</span></td>
      <td><span class="badge">${r.priority}</span></td>
      <td>${r.assignedTo}</td>
      <td>${r.date}</td>
    `;

    tbody.appendChild(row);
  });
}

/* ===== EVENTS ===== */

["requestSearch","statusFilter","typeFilter"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", renderRequests);
});

/* Init */
renderRequests();


/* ================= STATS ================= */

const totalRequests = maintenanceRequests.length;
const completed = maintenanceRequests.filter(r => r.status === 'repaired').length;
const open = maintenanceRequests.filter(r => r.status !== 'repaired').length;

document.getElementById('totalRequests').innerText = totalRequests;
document.getElementById('completionRate').innerText =
    Math.round((completed / totalRequests) * 100) + '%';
document.getElementById('openRequests').innerText = open;

/* ================= CHARTS ================= */

// Requests per Team
new Chart(document.getElementById('teamChart'), {
    type: 'bar',
    data: {
        labels: ['IT', 'Mechanics', 'Electrical'],
        datasets: [{
            label: 'Requests',
            data: [2, 2, 2],
            backgroundColor: '#0d9488'
        }]
    }
});

// Category Pie
new Chart(document.getElementById('categoryChart'), {
    type: 'pie',
    data: {
        labels: ['Computer', 'Machinery', 'Electrical'],
        datasets: [{
            data: [2, 2, 2],
            backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b']
        }]
    }
});

// Monthly Trend
new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Requests',
                data: [12, 15, 18, 14, 20, 16],
                borderColor: '#0d9488'
            },
            {
                label: 'Completed',
                data: [10, 14, 16, 13, 17, 12],
                borderColor: '#22c55e'
            }
        ]
    }
});

// Status Distribution
new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
        labels: ['New', 'In Progress', 'Repaired'],
        datasets: [{
            data: [2, 1, 3],
            backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e']
        }]
    }
});
/* ===== KANBAN DATA ===== */

const requests = [
  {
    id: "1",
    subject: "Fix Printer",
    type: "corrective",
    priority: "high",
    equipment: "Office Printer",
    dueDate: "2025-01-05",
    status: "new",
    createdAt: "2024-12-25"
  },
  {
    id: "2",
    subject: "CNC Maintenance",
    type: "preventive",
    priority: "medium",
    equipment: "CNC Machine",
    status: "in_progress",
    createdAt: "2024-12-20"
  },
  {
    id: "3",
    subject: "AC Repair",
    type: "corrective",
    priority: "critical",
    equipment: "HVAC",
    status: "repaired",
    createdAt: "2024-12-15"
  }
];

let draggedId = null;

/* ===== RENDER ===== */

function renderKanban() {
  ["new","in_progress","repaired","scrap"].forEach(s => {
    document.getElementById(s).innerHTML = "";
  });

  requests.forEach(r => {
    const card = document.createElement("div");
    card.className = "kanban-card";
    card.draggable = true;
    card.dataset.id = r.id;

    if (r.dueDate && new Date(r.dueDate) < new Date() && r.status !== "repaired") {
      card.classList.add("overdue");
    }

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between">
        <span class="badge ${r.priority}">${r.priority}</span>
        <span class="badge">${r.type}</span>
      </div>
      <strong>${r.subject}</strong>
      <p style="font-size:0.75rem">${r.equipment}</p>
      <div class="card-footer">
        <span>${r.dueDate || r.createdAt}</span>
      </div>
    `;

    card.addEventListener("dragstart", () => draggedId = r.id);
    document.getElementById(r.status).appendChild(card);
  });

  updateCounts();
}

/* ===== DRAG & DROP ===== */

document.querySelectorAll(".kanban-list").forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", () => {
    const req = requests.find(r => r.id === draggedId);
    if (req) {
      req.status = col.id;
      renderKanban();
    }
  });
});

/* ===== STATS ===== */

function updateCounts() {
  document.getElementById("stat-total").innerText = requests.length;
  document.getElementById("stat-completed").innerText =
    requests.filter(r => r.status === "repaired").length;
  document.getElementById("stat-open").innerText =
    requests.filter(r => r.status !== "repaired").length;
}

/* ===== INIT ===== */
renderKanban();

/* ===== CALENDAR DATA ===== */

const calendarRequests = [
  { subject: "CNC Preventive", date: "2025-01-10" },
  { subject: "AC Maintenance", date: "2025-01-15" },
  { subject: "Generator Check", date: "2025-01-18" }
];

let calendarDate = new Date();

/* ===== CALENDAR RENDER ===== */

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const title = document.getElementById("calendarTitle");
  const upcoming = document.getElementById("upcomingList");

  grid.innerHTML = "";
  upcoming.innerHTML = "";

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  title.innerText = calendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    cell.innerHTML = `<strong>${day}</strong>`;

    if (new Date().toDateString() === new Date(dateStr).toDateString()) {
      cell.classList.add("today");
    }

    calendarRequests
      .filter(r => r.date === dateStr)
      .forEach(r => {
        const event = document.createElement("div");
        event.className = "calendar-event";
        event.innerText = r.subject;
        cell.appendChild(event);
      });

    grid.appendChild(cell);
  }

  calendarRequests
    .filter(r => new Date(r.date) >= new Date())
    .forEach(r => {
      upcoming.innerHTML += `
        <div class="card">
          <strong>${r.subject}</strong>
          <p>${r.date}</p>
        </div>
      `;
    });
}

/* ===== CONTROLS ===== */

document.getElementById("prevMonth")?.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth")?.addEventListener("click", () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById("todayBtn")?.addEventListener("click", () => {
  calendarDate = new Date();
  renderCalendar();
});

renderCalendar();
function saveSettings() {
  alert("Settings saved successfully!");
}

function openNewRequest() {
  document.getElementById("newRequestModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("newRequestModal").classList.add("hidden");
}

async function createRequest() {
  const subject = document.getElementById("reqSubject").value;
  const description = document.getElementById("reqDescription").value;
  const type = document.getElementById("reqType").value;

  if (!subject || !description) {
    alert("Please fill all fields");
    return;
  }

  const res = await fetch("http://localhost:5000/api/maintenance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject,
      description,
      request_type: type
    })
  });

  if (res.ok) {
    alert("Request added successfully");
    closeModal();
    loadRequests(); // reload data
  } else {
    alert("Failed to add request");
  }
}
