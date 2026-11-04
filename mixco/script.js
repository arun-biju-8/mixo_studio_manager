
// ==========================================
// MIXCO STUDIO MANAGER
// Complete Application JavaScript
// ==========================================


// ==========================================
// 1. APPLICATION DATA
// ==========================================

let clients = JSON.parse(localStorage.getItem("mixco_clients")) || [];
let projects = JSON.parse(localStorage.getItem("mixco_projects")) || [];

let currentPage = "dashboard";


// ==========================================
// 2. COMMON FUNCTIONS
// ==========================================

function saveData() {
    localStorage.setItem("mixco_clients", JSON.stringify(clients));
    localStorage.setItem("mixco_projects", JSON.stringify(projects));
}

function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function formatCurrency(value) {
    return "₹" + Number(value || 0).toLocaleString("en-IN");
}


// ==========================================
// 3. LOADING SCREEN
// ==========================================

function hideLoader() {
    const loader = document.getElementById("loader");

    if (loader) {
        loader.classList.add("hidden");
    }
}

// Hide loader after initial page load
window.addEventListener("load", function () {
    setTimeout(hideLoader, 800);
});

// Safety fallback
setTimeout(hideLoader, 3000);


// ==========================================
// 4. NAVIGATION
// ==========================================

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        navigateTo(this.dataset.page);

    });

});


function navigateTo(page) {

    if (!["dashboard", "clients", "projects"].includes(page)) {
        return;
    }

    if (currentPage === page) {
        return;
    }

    currentPage = page;

    // Update active navigation
    document.querySelectorAll("nav a").forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.page === page
        );

    });

    const loader = document.getElementById("loader");

    if (loader) {
        loader.classList.remove("hidden");
    }

    // Render the selected page
    setTimeout(function () {

        try {
            renderPage();
        } catch (error) {
            console.error("Page rendering error:", error);
        }

        setTimeout(hideLoader, 400);

    }, 450);

}


// ==========================================
// 5. PAGE RENDERING
// ==========================================

function renderPage() {

    const pageTitle = document.getElementById("page-title");

    const titles = {
        dashboard: "Dashboard",
        clients: "Clients",
        projects: "Projects"
    };

    if (pageTitle) {
        pageTitle.textContent = titles[currentPage];
    }

    if (currentPage === "dashboard") {
        renderDashboard();
    }

    if (currentPage === "clients") {
        renderClients();
    }

    if (currentPage === "projects") {
        renderProjects();
    }

}


// ==========================================
// 6. DASHBOARD
// ==========================================

function renderDashboard() {

    const content = document.getElementById("app-content");

    const activeProjects = projects.filter(
        p => p.status === "In Progress"
    ).length;

    const completedProjects = projects.filter(
        p => p.status === "Completed"
    ).length;

    const planningProjects = projects.filter(
        p => p.status === "Planning"
    ).length;

    const recentProjects = [...projects].slice(-5).reverse();

    const recentClients = [...clients].slice(-4).reverse();

    content.innerHTML = `

        <div class="welcome-panel">

            <div>
                <span class="welcome-label">STUDIO OVERVIEW</span>
                <h2>Welcome to MIXCO Studio.</h2>
                <p>Your workspace for managing music production and studio operations.</p>
            </div>

            <div class="welcome-actions">

                <button class="btn" onclick="navigateTo('projects')">
                    + New Project
                </button>

                <button class="btn btn-secondary"
                    onclick="navigateTo('clients')">
                    + Add Client
                </button>

            </div>

        </div>


        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-heading">
                    <span>Total Clients</span>
                    <span class="stat-icon">♬</span>
                </div>
                <h2>${clients.length}</h2>
                <small>Registered studio clients</small>
            </div>

            <div class="stat-card">
                <div class="stat-heading">
                    <span>Total Projects</span>
                    <span class="stat-icon">♫</span>
                </div>
                <h2>${projects.length}</h2>
                <small>All production projects</small>
            </div>

            <div class="stat-card">
                <div class="stat-heading">
                    <span>In Progress</span>
                    <span class="stat-icon">◉</span>
                </div>
                <h2>${activeProjects}</h2>
                <small>Currently being produced</small>
            </div>

            <div class="stat-card">
                <div class="stat-heading">
                    <span>Completed</span>
                    <span class="stat-icon">✓</span>
                </div>
                <h2>${completedProjects}</h2>
                <small>Successfully completed</small>
            </div>

        </div>


        <div class="panel">

            <div class="panel-header">
                <h3>Production Overview</h3>
                <span class="welcome-label">PROJECT STATUS</span>
            </div>

            <div class="overview-grid">

                <div class="overview-item">
                    <span class="overview-dot planning"></span>
                    <div>
                        <h3>${planningProjects}</h3>
                        <p>Planning</p>
                    </div>
                </div>

                <div class="overview-item">
                    <span class="overview-dot progress"></span>
                    <div>
                        <h3>${activeProjects}</h3>
                        <p>In Progress</p>
                    </div>
                </div>

                <div class="overview-item">
                    <span class="overview-dot completed"></span>
                    <div>
                        <h3>${completedProjects}</h3>
                        <p>Completed</p>
                    </div>
                </div>

            </div>

        </div>


        <div class="panel">

            <div class="panel-header">
                <h3>Recent Projects</h3>

                <button class="btn btn-secondary"
                    onclick="navigateTo('projects')">
                    View All
                </button>
            </div>

            ${recentProjects.length === 0
                ? `<div class="empty-state">
                    No projects yet. Start by creating your first project.
                   </div>`

                : `
                <table>
                    <thead>
                        <tr>
                            <th>PROJECT</th>
                            <th>CLIENT</th>
                            <th>TYPE</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${recentProjects.map(project => `
                            <tr>
                                <td>${escapeHTML(project.name)}</td>
                                <td>${escapeHTML(project.client)}</td>
                                <td>${escapeHTML(project.type)}</td>
                                <td>
                                    <span class="status ${project.status === "Completed" ? "completed" : ""}">
                                        ${escapeHTML(project.status)}
                                    </span>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                `
            }

        </div>


        <div class="panel">

            <div class="panel-header">
                <h3>Recently Added Clients</h3>

                <button class="btn btn-secondary"
                    onclick="navigateTo('clients')">
                    View All
                </button>
            </div>

            ${recentClients.length === 0
                ? `<div class="empty-state">
                    No clients registered yet.
                   </div>`

                : `
                <table>
                    <thead>
                        <tr>
                            <th>CLIENT</th>
                            <th>ARTIST / BAND</th>
                            <th>EMAIL</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${recentClients.map(client => `
                            <tr>
                                <td>${escapeHTML(client.name)}</td>
                                <td>${escapeHTML(client.artist)}</td>
                                <td>${escapeHTML(client.email)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                `
            }

        </div>


        <div class="dashboard-footer">
            <span>MIXCO STUDIO MANAGER</span>
            <span>Music Production & Management</span>
        </div>

    `;

}


// ==========================================
// 7. CLIENT MANAGEMENT
// ==========================================

function renderClients() {

    const content = document.getElementById("app-content");

    content.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div>
                    <h3>Studio Clients</h3>
                    <p>Manage your artists, bands and customers.</p>
                </div>

                <button class="btn" onclick="openClientModal()">
                    + Add Client
                </button>

            </div>

            <input
                type="text"
                id="client-search"
                class="search-input"
                placeholder="Search clients..."
            >

            <div id="clients-table"></div>

        </div>

    `;

    renderClientsTable();

    document.getElementById("client-search").addEventListener("input", function () {
        renderClientsTable(this.value);
    });

}


function renderClientsTable(search = "") {

    const table = document.getElementById("clients-table");

    const filteredClients = clients.filter(client => {

        const searchText = [
            client.name,
            client.email,
            client.phone,
            client.artist
        ].join(" ").toLowerCase();

        return searchText.includes(search.toLowerCase());

    });

    if (filteredClients.length === 0) {

        table.innerHTML = `
            <div class="empty-state">
                No clients found.
            </div>
        `;

        return;
    }

    table.innerHTML = `

        <table>

            <thead>
                <tr>
                    <th>CLIENT</th>
                    <th>ARTIST / BAND</th>
                    <th>EMAIL</th>
                    <th>PHONE</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>

            <tbody>

                ${filteredClients.map(client => `

                    <tr>

                        <td>${escapeHTML(client.name)}</td>
                        <td>${escapeHTML(client.artist)}</td>
                        <td>${escapeHTML(client.email)}</td>
                        <td>${escapeHTML(client.phone)}</td>

                        <td>
                            <button class="btn btn-secondary"
                                onclick="editClient('${client.id}')">
                                Edit
                            </button>

                            <button class="btn btn-danger"
                                onclick="deleteClient('${client.id}')">
                                Delete
                            </button>
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


// ==========================================
// 8. ADD / EDIT CLIENT
// ==========================================

function openClientModal(id = null) {

    const client = id
        ? clients.find(c => c.id === id)
        : null;

    const modal = document.createElement("div");

    modal.className = "modal-overlay";
    modal.id = "client-modal";

    modal.innerHTML = `

        <div class="modal">

            <div class="panel-header">
                <h3>${client ? "Edit Client" : "Add New Client"}</h3>

                <button class="modal-close"
                    onclick="closeModal('client-modal')">
                    ✕
                </button>
            </div>

            <form id="client-form">

                <div class="form-group">
                    <label>Client Name</label>
                    <input type="text" id="client-name"
                        value="${escapeHTML(client?.name || "")}"
                        required>
                </div>

                <div class="form-group">
                    <label>Artist / Band Name</label>
                    <input type="text" id="client-artist"
                        value="${escapeHTML(client?.artist || "")}"
                        required>
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="client-email"
                        value="${escapeHTML(client?.email || "")}"
                        required>
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="client-phone"
                        value="${escapeHTML(client?.phone || "")}"
                        required>
                </div>

                <div class="form-actions">

                    <button type="button" class="btn btn-secondary"
                        onclick="closeModal('client-modal')">
                        Cancel
                    </button>

                    <button type="submit" class="btn">
                        ${client ? "Update Client" : "Save Client"}
                    </button>

                </div>

            </form>

        </div>

    `;

    document.body.appendChild(modal);

    document.getElementById("client-form").addEventListener("submit", function (event) {

        event.preventDefault();

        const clientData = {
            id: client ? client.id : generateId(),
            name: document.getElementById("client-name").value.trim(),
            artist: document.getElementById("client-artist").value.trim(),
            email: document.getElementById("client-email").value.trim(),
            phone: document.getElementById("client-phone").value.trim()
        };

        if (client) {

            clients = clients.map(c =>
                c.id === client.id ? clientData : c
            );

        } else {

            clients.push(clientData);

        }

        saveData();
        closeModal("client-modal");
        renderPage();

    });

}


function editClient(id) {
    openClientModal(id);
}


function deleteClient(id) {

    const client = clients.find(c => c.id === id);

    if (!client) return;

    const hasProjects = projects.some(
        project => project.clientId === id
    );

    if (hasProjects) {
        alert("This client has associated projects. Delete or reassign those projects first.");
        return;
    }

    if (!confirm(`Delete ${client.name}?`)) return;

    clients = clients.filter(c => c.id !== id);

    saveData();
    renderClients();

}


// ==========================================
// 9. PROJECT MANAGEMENT
// ==========================================

function renderProjects() {

    const content = document.getElementById("app-content");

    content.innerHTML = `

        <div class="panel">

            <div class="panel-header">

                <div>
                    <h3>Studio Projects</h3>
                    <p>Track your music production projects.</p>
                </div>

                <button class="btn" onclick="openProjectModal()">
                    + New Project
                </button>

            </div>

            <input
                type="text"
                id="project-search"
                class="search-input"
                placeholder="Search projects..."
            >

            <div id="projects-table"></div>

        </div>

    `;

    renderProjectsTable();

    document.getElementById("project-search").addEventListener("input", function () {
        renderProjectsTable(this.value);
    });

}


function renderProjectsTable(search = "") {

    const table = document.getElementById("projects-table");

    const filteredProjects = projects.filter(project => {

        const searchText = [
            project.name,
            project.client,
            project.type,
            project.status
        ].join(" ").toLowerCase();

        return searchText.includes(search.toLowerCase());

    });

    if (filteredProjects.length === 0) {

        table.innerHTML = `
            <div class="empty-state">
                No projects found. Create your first studio project.
            </div>
        `;

        return;
    }

    table.innerHTML = `

        <table>

            <thead>
                <tr>
                    <th>PROJECT</th>
                    <th>CLIENT</th>
                    <th>TYPE</th>
                    <th>BUDGET</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>

            <tbody>

                ${filteredProjects.map(project => `

                    <tr>

                        <td>${escapeHTML(project.name)}</td>
                        <td>${escapeHTML(project.client)}</td>
                        <td>${escapeHTML(project.type)}</td>
                        <td>${formatCurrency(project.budget)}</td>

                        <td>
                            <span class="status ${project.status === "Completed" ? "completed" : ""}">
                                ${escapeHTML(project.status)}
                            </span>
                        </td>

                        <td>

                            <button class="btn btn-secondary"
                                onclick="editProject('${project.id}')">
                                Edit
                            </button>

                            <button class="btn btn-danger"
                                onclick="deleteProject('${project.id}')">
                                Delete
                            </button>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}


// ==========================================
// 10. ADD / EDIT PROJECT
// ==========================================

function openProjectModal(id = null) {

    if (clients.length === 0) {

        alert("Please add a client before creating a project.");

        navigateTo("clients");

        return;
    }

    const project = id
        ? projects.find(p => p.id === id)
        : null;

    const modal = document.createElement("div");

    modal.className = "modal-overlay";
    modal.id = "project-modal";

    modal.innerHTML = `

        <div class="modal">

            <div class="panel-header">
                <h3>${project ? "Edit Project" : "New Studio Project"}</h3>

                <button class="modal-close"
                    onclick="closeModal('project-modal')">
                    ✕
                </button>
            </div>

            <form id="project-form">

                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" id="project-name"
                        value="${escapeHTML(project?.name || "")}"
                        required>
                </div>

                <div class="form-group">
                    <label>Select Client</label>

                    <select id="project-client" required>

                        <option value="">Choose a client</option>

                        ${clients.map(client => `
                            <option value="${escapeHTML(client.id)}"
                                ${project?.clientId === client.id ? "selected" : ""}>
                                ${escapeHTML(client.name)} — ${escapeHTML(client.artist)}
                            </option>
                        `).join("")}

                    </select>
                </div>

                <div class="form-group">
                    <label>Project Type</label>

                    <select id="project-type" required>

                        ${[
                            "Music Production",
                            "Mixing",
                            "Mastering",
                            "Recording",
                            "Album"
                        ].map(type => `
                            <option value="${type}"
                                ${project?.type === type ? "selected" : ""}>
                                ${type}
                            </option>
                        `).join("")}

                    </select>
                </div>

                <div class="form-group">
                    <label>Budget (₹)</label>
                    <input type="number" id="project-budget"
                        min="0"
                        value="${escapeHTML(project?.budget ?? "")}"
                        required>
                </div>

                <div class="form-group">
                    <label>Project Status</label>

                    <select id="project-status">

                        ${[
                            "Planning",
                            "In Progress",
                            "Completed"
                        ].map(status => `
                            <option value="${status}"
                                ${project?.status === status ? "selected" : ""}>
                                ${status}
                            </option>
                        `).join("")}

                    </select>
                </div>

                <div class="form-actions">

                    <button type="button" class="btn btn-secondary"
                        onclick="closeModal('project-modal')">
                        Cancel
                    </button>

                    <button type="submit" class="btn">
                        ${project ? "Update Project" : "Save Project"}
                    </button>

                </div>

            </form>

        </div>

    `;

    document.body.appendChild(modal);

    document.getElementById("project-form").addEventListener("submit", function (event) {

        event.preventDefault();

        const selectedClientId =
            document.getElementById("project-client").value;

        const selectedClient = clients.find(
            c => c.id === selectedClientId
        );

        if (!selectedClient) {
            alert("Please select a valid client.");
            return;
        }

        const projectData = {

            id: project ? project.id : generateId(),

            name: document.getElementById("project-name").value.trim(),

            clientId: selectedClient.id,

            client: selectedClient.name,

            type: document.getElementById("project-type").value,

            budget: Number(document.getElementById("project-budget").value),

            status: document.getElementById("project-status").value

        };

        if (project) {

            projects = projects.map(p =>
                p.id === project.id ? projectData : p
            );

        } else {

            projects.push(projectData);

        }

        saveData();
        closeModal("project-modal");
        renderPage();

    });

}


function editProject(id) {
    openProjectModal(id);
}


function deleteProject(id) {

    const project = projects.find(p => p.id === id);

    if (!project) return;

    if (!confirm(`Delete project "${project.name}"?`)) return;

    projects = projects.filter(p => p.id !== id);

    saveData();
    renderProjects();

}


// ==========================================
// 11. MODAL CONTROL
// ==========================================

function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.remove();
    }

}


// ==========================================
// 12. INITIALIZE APPLICATION
// ==========================================

try {

    renderPage();

} catch (error) {

    console.error("Application initialization failed:", error);

    const content = document.getElementById("app-content");

    if (content) {
        content.innerHTML = `
            <div class="empty-state">
                Unable to load the application. Check the browser console.
            </div>
        `;
    }

} finally {

    // Ensure the loading screen cannot remain stuck
    setTimeout(hideLoader, 1200);

}
