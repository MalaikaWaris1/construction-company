document.addEventListener("DOMContentLoaded", () => {
    
    // --- REAL BACKEND API CONFIGURATION ---
   const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:8000/api" 
  : "https://backend-construction-94n3.onrender.com/api";
    
    // Arrays backend se live sync honge
    let projectsArray = [];
    let teamArray = [];
    let inquiriesArray = [];
    let subscribersArray = []; // 🟢 FIXED: Missing array initialized

    // --- DOM ELEMENT REFERENCES ---
    const authContainer = document.getElementById("auth-container");
    const adminDashboard = document.getElementById("admin-dashboard");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    
    // Auth Switch Toggles
    document.getElementById("go-to-register").addEventListener("click", () => {
        loginForm.classList.remove("active");
        registerForm.classList.add("active");
        document.getElementById("auth-subtitle").innerText = "Create New Master Control Key";
    });
    
    document.getElementById("go-to-login").addEventListener("click", () => {
        registerForm.classList.remove("active");
        loginForm.classList.add("active");
        document.getElementById("auth-subtitle").innerText = "Secure Access Management Portal";
    });

    // --- STEP 1: REAL AUTH INTEGRATION ---
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password })
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("adminToken", data.token);
                authContainer.classList.add("hidden");
                adminDashboard.classList.remove("hidden");
                fetchAllData(); 
            } else {
                alert(data.message || "Invalid Credentials!");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Backend server se connect nahi ho paaya!");
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password })
            });
            const data = await response.json();

            if (response.ok) {
                alert("Administrative Identity Created Safely! Please login now.");
                registerForm.classList.remove("active");
                loginForm.classList.add("active");
            } else {
                alert(data.message || "Registration Failed!");
            }
        } catch (error) {
            alert("Server Error during registration!");
        }
    });
    
    document.getElementById("portal-logout-btn").addEventListener("click", () => {
        localStorage.removeItem("adminToken"); 
        adminDashboard.classList.add("hidden");
        authContainer.classList.remove("hidden");
    });

    // --- STEP 2: WORKSPACE TABS SYSTEM ROUTER ---
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".dashboard-section");
    const viewTitle = document.getElementById("current-view-title");

    // 🟢 FIXED: Hardcoding se bachne ke liye clean JavaScript Lookup Map
    const titleMap = {
        "projects-view": "Projects Management Board",
        "team-view": "Executive Organization Team",
        "inquiries-view": "Client Pipeline Enquiries Log",
        "subscribers-view": "Newsletter Subscribers List"
    };

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const target = item.getAttribute("data-target");
            sections.forEach(sec => {
                sec.id === target ? sec.classList.add("active") : sec.classList.remove("active");
            });

            // Auto title update bina kisi lambi 'if' statements ke
            if (titleMap[target]) {
                viewTitle.innerText = titleMap[target];
            }
        });
    });

    // --- STEP 3: DYNAMIC MODAL BOXES SYSTEMS ENGINE ---
    const openModalButtons = document.querySelectorAll(".open-modal-btn");
    const closeModalButtons = document.querySelectorAll(".close-modal-btn");

    openModalButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal");
            document.getElementById(modalId).classList.add("active");
        });
    });

    closeModalButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const targetModal = e.target.closest(".modal-overlay");
            if (targetModal) {
                targetModal.classList.remove("active");
                const form = targetModal.querySelector("form");
                if(form) form.reset();
                document.getElementById("project-edit-id").value = "";
                document.getElementById("team-edit-id").value = "";
            }
        });
    });

// --- STEP 4: DATA FETCHING ENGINE ---
async function fetchAllData() {
    try {
        // 🟢 FIXED: Subscribers API call ko bhi includes kiya
        const [projRes, teamRes, inqRes, subRes] = await Promise.all([
            fetch(`${API_BASE_URL}/projects`),
            fetch(`${API_BASE_URL}/team`),
            fetch(`${API_BASE_URL}/inquiries`),
            fetch(`${API_BASE_URL}/newsletter`) // Apne route ke mutabiq change kar lein
        ]);

        projectsArray = await projRes.json();
        teamArray = await teamRes.json();
        inquiriesArray = await inqRes.json();

        // 🌟 FIXED: Pehle response ko parse kiya, phir usme se '.data' array ko nikala
        const subResult = await subRes.json();
        subscribersArray = subResult.data || subResult; 

        renderProjects();
        renderTeam();
        renderInquiries();
        renderSubscribers(); // 🟢 FIXED
    } catch (error) {
        console.error("Error loading data from database:", error);
    }
}

    // A. Projects Template Renderer
    function renderProjects() {
        const container = document.getElementById("projects-data-container");
        container.innerHTML = "";
        
        projectsArray.forEach(p => {
            const tagsHTML = Array.isArray(p.tags) ? p.tags.map(t => `<span>${t.trim()}</span>`).join("") : '';
            const card = document.createElement("div");
            card.className = "premium-card";
            card.innerHTML = `
                <div>
                    <div class="card-category">${p.category}</div>
                    <h4>${p.title}</h4>
                    <div class="card-details"><strong>Year:</strong> ${p.completedYear} | <strong>Scale:</strong> ${p.scale}</div>
                    <div class="card-details"><strong>Location:</strong> ${p.location}</div>
                    <p class="card-description">${p.description}</p>
                    <div class="tag-badges-row">${tagsHTML}</div>
                </div>
                <div class="card-management-actions">
                    <button class="btn-edit-action" onclick="triggerEditProject('${p._id || p.id}')">Edit Case</button>
                    <button class="btn-delete-action" onclick="triggerDeleteProject('${p._id || p.id}')">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // B. Team Cards Renderer
    function renderTeam() {
        const container = document.getElementById("team-data-container");
        container.innerHTML = "";
        
        teamArray.forEach(t => {
            const tagsHTML = Array.isArray(t.tags) ? t.tags.map(tag => `<span>${tag.trim()}</span>`).join("") : '';
            const card = document.createElement("div");
            card.className = "premium-card";
            card.innerHTML = `
                <div>
                    <div class="card-category">${t.role}</div>
                    <h4>${t.name}</h4>
                    <div class="card-details"><strong>Seniority Status:</strong> ${t.experience}</div>
                    <p class="card-description">${t.description}</p>
                    <div class="tag-badges-row">${tagsHTML}</div>
                </div>
                <div class="card-management-actions">
                    <button class="btn-edit-action" onclick="triggerEditTeam('${t._id || t.id}')">Modify Row</button>
                    <button class="btn-delete-action" onclick="triggerDeleteTeam('${t._id || t.id}')">Remove</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // C. Inquiries Table Data Rows
    function renderInquiries() {
        const tbody = document.getElementById("inquiries-table-body");
        tbody.innerHTML = "";
        
        inquiriesArray.forEach(i => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="font-semibold">${i.firstName} ${i.lastName}</td>
                <td>${i.email}<br><span class="text-muted">${i.phone}</span></td>
                <td><span class="tag-badges-row"><span>${i.inquiryType}</span></span></td>
                <td style="max-width: 250px; font-size:13px;">${i.details}</td>
                <td><button class="btn-delete-action" onclick="triggerDeleteInquiry('${i._id || i.id}')">Archive</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    // D. Newsletter Subscribers Renderer
    function renderSubscribers() {
        const tbody = document.getElementById("subscribers-table-body");
        tbody.innerHTML = "";
        
        subscribersArray.forEach(s => {
            const isSubscribed = s.status === "subscribed";
            const badgeClass = isSubscribed ? "active-sub" : "inactive-sub";
            const dateFormatted = new Date(s.createdAt).toLocaleDateString("en-US", {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="font-semibold">${s.email}</td>
                <td><span class="status-badge ${badgeClass}">${s.status}</span></td>
                <td>${dateFormatted}</td>
                <td>
                    <button class="btn-delete-action" onclick="triggerDeleteSubscriber('${s._id || s.id}')">
                        Remove
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // --- STEP 5: ACTIONS FORM CRUD LIVE LISTENERS ---
    // 🟢 FIXED: Ab ye block DOMContentLoaded ke andar hai, isliye errors nahi dega
    
    document.getElementById("project-crud-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const editId = document.getElementById("project-edit-id").value;
        
        const projectData = {
            category: document.getElementById("proj-category").value,
            title: document.getElementById("proj-title").value,
            completedYear: document.getElementById("proj-year").value,
            scale: document.getElementById("proj-scale").value,
            location: document.getElementById("proj-location").value,
            tags: document.getElementById("proj-tags").value.split(","),
            caseStudyUrl: document.getElementById("proj-casestudy").value,
            blueprintUrl: document.getElementById("proj-blueprint").value,
            description: document.getElementById("proj-desc").value
        };

        const url = editId ? `${API_BASE_URL}/projects/${editId}` : `${API_BASE_URL}/projects`;
        const method = editId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectData)
            });

            if (response.ok) {
                document.getElementById("project-modal").classList.remove("active");
                document.getElementById("project-crud-form").reset();
                document.getElementById("project-edit-id").value = "";
                fetchAllData(); 
            }
        } catch (error) {
            alert("Project save karne mein error aaya!");
        }
    });

    document.getElementById("team-crud-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const editId = document.getElementById("team-edit-id").value;
        
        const memberData = {
            name: document.getElementById("team-name").value,
            role: document.getElementById("team-role").value,
            experience: document.getElementById("team-experience").value,
            tags: document.getElementById("team-tags").value.split(","),
            description: document.getElementById("team-desc").value
        };

        const url = editId ? `${API_BASE_URL}/team/${editId}` : `${API_BASE_URL}/team`;
        const method = editId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(memberData)
            });

            if (response.ok) {
                document.getElementById("team-modal").classList.remove("active");
                document.getElementById("team-crud-form").reset();
                document.getElementById("team-edit-id").value = "";
                fetchAllData();
            }
        } catch (error) {
            alert("Team data save karne mein error aaya!");
        }
    });

    // --- STEP 6: GLOBAL SCOPE UTILITIES FOR DATABASE ACTIONS ---
    // 🟢 FIXED: Ab window parameters correct arrays aur database config ke sath globally work karenge
    
    window.triggerDeleteProject = async (id) => {
        if(confirm("Confirm removal of this project case study?")) {
            try {
                await fetch(`${API_BASE_URL}/projects/${id}`, { method: "DELETE" });
                fetchAllData();
            } catch (error) {
                alert("Could not delete project");
            }
        }
    };

    window.triggerEditProject = (id) => {
        const p = projectsArray.find(proj => (proj._id || proj.id) === id);
        if(p) {
            document.getElementById("project-edit-id").value = id;
            document.getElementById("proj-category").value = p.category;
            document.getElementById("proj-title").value = p.title;
            document.getElementById("proj-year").value = p.completedYear;
            document.getElementById("proj-scale").value = p.scale;
            document.getElementById("proj-location").value = p.location;
            document.getElementById("proj-tags").value = Array.isArray(p.tags) ? p.tags.join(",") : p.tags;
            document.getElementById("proj-casestudy").value = p.caseStudyUrl;
            document.getElementById("proj-blueprint").value = p.blueprintUrl;
            document.getElementById("proj-desc").value = p.description;
            
            document.getElementById("project-modal-title").innerText = "Modify Existing Project Case";
            document.getElementById("project-modal").classList.add("active");
        }
    };

    window.triggerDeleteTeam = async (id) => {
        if(confirm("Permanently archive this personnel entry record?")) {
            try {
                await fetch(`${API_BASE_URL}/team/${id}`, { method: "DELETE" });
                fetchAllData();
            } catch (error) {
                alert("Could not delete team member");
            }
        }
    };

    window.triggerEditTeam = (id) => {
        const t = teamArray.find(team => (team._id || team.id) === id);
        if(t) {
            document.getElementById("team-edit-id").value = id;
            document.getElementById("team-name").value = t.name;
            document.getElementById("team-role").value = t.role;
            document.getElementById("team-experience").value = t.experience;
            document.getElementById("team-tags").value = Array.isArray(t.tags) ? t.tags.join(",") : t.tags;
            document.getElementById("team-desc").value = t.description;
            
            document.getElementById("team-modal-title").innerText = "Update Executive Member Data";
            document.getElementById("team-modal").classList.add("active");
        }
    };

    window.triggerDeleteInquiry = async (id) => {
        if(confirm("Archive this client enquiry?")) {
            try {
                await fetch(`${API_BASE_URL}/inquiries/${id}`, { method: "DELETE" });
                fetchAllData();
            } catch (error) {
                alert("Could not delete inquiry");
            }
        }
    };

    // 🟢 FIXED: Missing triggerDeleteSubscriber Function
    window.triggerDeleteSubscriber = async (id) => {
        if(confirm("Are you sure you want to remove this subscriber?")) {
            try {
                await fetch(`${API_BASE_URL}/newsletter/${id}`, { method: "DELETE" });
                fetchAllData();
            } catch (error) {
                alert("Could not delete subscriber");
            }
        }
    };

}); // 🟢 FIXED: DOMContentLoaded ka sahi closing bracket jo ab sabse end par hai!
