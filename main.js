/*
 * -----------------------------------------------------------------------------
 * ML MAVERICKS - MAIN.JS (v2.0 - Multi-Page)
 * -----------------------------------------------------------------------------
 */

// --- 1. COMPONENT LOADER ---
async function loadComponents() {
    const elements = document.querySelectorAll('[data-include]');
    for (const el of elements) {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`File not found: ${file}`);
            const html = await response.text();
            el.innerHTML = html;
        } catch (err) {
            console.error(err);
            el.innerHTML = `<p class="text-red-500 text-center">Error loading ${file}</p>`;
        }
    }
}

// --- 2. ACTIVE NAV LINK HIGHLIGHTER ---
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll(`[data-nav-id]`);
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-nav-id');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// --- 3. 3D NEURAL NETWORK ---
function initNeuralNetwork() {
    const container = document.getElementById('neural-canvas-container');
    if (!container || typeof THREE === 'undefined') return; 

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const numPoints = 150;
    const points = new Float32Array(numPoints * 3);
    const particlesData = [];
    
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
        particlesData.push({
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01)
        });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({ color: 0x00FFFF, size: 0.05, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF0055, transparent: true, opacity: 0.05 });
    const linesGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    function animate() {
        requestAnimationFrame(animate);
        const positions = particles.geometry.attributes.position.array;
        const linePositions = [];
        
        for (let i = 0; i < numPoints; i++) {
            const i3 = i * 3;
            positions[i3] += particlesData[i].velocity.x;
            positions[i3 + 1] += particlesData[i].velocity.y;
            positions[i3 + 2] += particlesData[i].velocity.z;

            if (positions[i3] > 7.5 || positions[i3] < -7.5) particlesData[i].velocity.x *= -1;
            if (positions[i3 + 1] > 7.5 || positions[i3 + 1] < -7.5) particlesData[i].velocity.y *= -1;
            if (positions[i3 + 2] > 7.5 || positions[i3 + 2] < -7.5) particlesData[i].velocity.z *= -1;

            for (let j = i + 1; j < numPoints; j++) {
                const j3 = j * 3;
                const dx = positions[i3] - positions[j3];
                const dy = positions[i3 + 1] - positions[j3 + 1];
                const dz = positions[i3 + 2] - positions[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 1.2) {
                    linePositions.push(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                    linePositions.push(positions[j3], positions[j3 + 1], positions[j3 + 2]);
                }
            }
        }
        
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        particles.geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// --- 4. 3D TILT EFFECT ---
function initTiltEffect() {
    if (typeof VanillaTilt === 'undefined') return;
    const tiltElements = document.querySelectorAll('.tilt-card, .tilt-card-project');
    if (tiltElements.length > 0) {
        VanillaTilt.init(tiltElements, { max: 15, speed: 400, glare: true, "max-glare": 0.25 });
    }
}

// --- 5. NAVBAR MOBILE MENU LOGIC ---
function attachNavbarLogic() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const icon = btn.querySelector('i');
            if (menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });
    }
    highlightActiveNav();
}

// --- 6. MULTI-EVENT REGISTRATION LOGIC ---
function initEventsPage() {
    // Event Tab Buttons & View Panes
    const tabBtnInfosys = document.getElementById('tab-infosys');
    const tabBtnIndustrial = document.getElementById('tab-industrial');
    const viewPaneInfosys = document.getElementById('event-view-infosys');
    const viewPaneIndustrial = document.getElementById('event-view-industrial');

    // Tab Switching Handler
    function switchEventTab(targetEvent) {
        if (targetEvent === 'infosys-registration') {
            if (viewPaneInfosys) viewPaneInfosys.classList.remove('hidden');
            if (viewPaneIndustrial) viewPaneIndustrial.classList.add('hidden');
            
            if (tabBtnInfosys) {
                tabBtnInfosys.className = "event-tab-btn flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-brand-cyan text-black shadow-lg shadow-brand-cyan/20 border border-brand-cyan";
            }
            if (tabBtnIndustrial) {
                tabBtnIndustrial.className = "event-tab-btn flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-gray-900/80 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white";
            }
        } else if (targetEvent === 'industrial-visit') {
            if (viewPaneIndustrial) viewPaneIndustrial.classList.remove('hidden');
            if (viewPaneInfosys) viewPaneInfosys.classList.add('hidden');
            
            if (tabBtnIndustrial) {
                tabBtnIndustrial.className = "event-tab-btn flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-brand-pink text-white shadow-lg shadow-brand-pink/20 border border-brand-pink";
            }
            if (tabBtnInfosys) {
                tabBtnInfosys.className = "event-tab-btn flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-gray-900/80 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white";
            }
        }
    }

    if (tabBtnInfosys) {
        tabBtnInfosys.addEventListener('click', () => switchEventTab('infosys-registration'));
    }
    if (tabBtnIndustrial) {
        tabBtnIndustrial.addEventListener('click', () => switchEventTab('industrial-visit'));
    }

    // Infosys Form Elements
    const infosysForm = document.getElementById('infosys-registration-form');
    const previewModal = document.getElementById('preview-modal');

    // Google Sheets & Drive Script URLs
    const eventScriptURLs = {
        'infosys-registration': 'https://script.google.com/macros/s/AKfycbwhBsufCEFBVAM4pK1Pp_0dB1GU9n6-7oKDtEZN1mKm8xLR86p7FczRWaJ9qSPQIygc/exec',
        'industrial-visit': 'https://script.google.com/macros/s/AKfycby4ABHKCRkB9L50RtSrCCdir8qhaOhqgCnCGR9kr4iBQt3ljAFi87hw73BgAIKUDrZz/exec'
    };

    let pendingPayload = null;

    // Helper: Convert File to Base64
    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // reader.result is like "data:application/pdf;base64,JVBERi0x..."
                const resultStr = reader.result;
                const base64Content = resultStr.split(',')[1] || resultStr;
                resolve(base64Content);
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // 1. Form Submit -> Validation & Open Preview Modal
    if (infosysForm) {
        infosysForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!infosysForm.checkValidity()) {
                infosysForm.reportValidity();
                return;
            }

            const nameInput = document.getElementById('infosys-name');
            const rollInput = document.getElementById('infosys-rollNumber');
            const yearBranchInput = document.getElementById('infosys-yearBranch');
            const emailInput = document.getElementById('infosys-email');
            const phoneInput = document.getElementById('infosys-phone');
            const fileInput = document.getElementById('infosys-pdfFile');

            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                alert("Please select your PDF certificate file.");
                return;
            }

            const selectedFile = fileInput.files[0];

            // Validate PDF format
            if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
                alert("Only PDF files are allowed. Please choose a .pdf certificate file.");
                return;
            }

            // Max file size: 5MB
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit. Please upload a smaller PDF file.");
                return;
            }

            // Capitalize Roll Number
            const rollVal = rollInput.value.trim().toUpperCase();
            rollInput.value = rollVal;

            const nameVal = nameInput.value.trim();
            const yearBranchVal = yearBranchInput.value;
            const emailVal = emailInput.value.trim();
            const phoneVal = phoneInput.value.trim();

            try {
                // Convert PDF to Base64 for submission
                const base64Data = await readFileAsBase64(selectedFile);

                pendingPayload = {
                    event: 'infosys-registration',
                    name: nameVal,
                    rollNumber: rollVal,
                    yearBranch: yearBranchVal,
                    email: emailVal,
                    phone: phoneVal,
                    fileName: selectedFile.name,
                    fileBase64: base64Data,
                    mimeType: selectedFile.type || 'application/pdf'
                };

                // Populate Preview Modal
                const previewName = document.getElementById('preview-name');
                const previewRoll = document.getElementById('preview-roll');
                const previewYearBranch = document.getElementById('preview-yearBranch');
                const previewEmail = document.getElementById('preview-email');
                const previewPhone = document.getElementById('preview-phone');
                const previewFileName = document.getElementById('preview-fileName');

                if (previewName) previewName.innerText = nameVal;
                if (previewRoll) previewRoll.innerText = rollVal;
                if (previewYearBranch) previewYearBranch.innerText = yearBranchVal;
                if (previewEmail) previewEmail.innerText = emailVal;
                if (previewPhone) previewPhone.innerText = phoneVal;
                if (previewFileName) previewFileName.innerText = selectedFile.name;

                // Reset preview feedback message box
                const feedbackBox = document.getElementById('preview-form-message');
                if (feedbackBox) {
                    feedbackBox.classList.add('hidden');
                    feedbackBox.innerHTML = '';
                }

                // Open Preview Modal
                if (previewModal) {
                    previewModal.classList.remove('hidden');
                }
            } catch (err) {
                console.error("Error reading file:", err);
                alert("Unable to process the PDF file. Please try selecting the file again.");
            }
        });
    }

    // Modal Control Functions
    function hidePreviewModal() {
        if (previewModal) {
            previewModal.classList.add('hidden');
        }
        // Restore modal buttons
        if (confirmSubmitBtn) {
            confirmSubmitBtn.disabled = false;
            const submitText = document.getElementById('confirm-submit-text');
            if (submitText) submitText.innerText = "Confirm & Submit";
        }
        if (cancelSubmitBtn) {
            cancelSubmitBtn.innerText = "Edit Details";
        }
    }

    const closePreviewBtn = document.getElementById('close-preview-btn');
    const cancelSubmitBtn = document.getElementById('cancel-submit-btn');
    const previewModalOverlay = document.getElementById('preview-modal-overlay');

    if (closePreviewBtn) closePreviewBtn.addEventListener('click', hidePreviewModal);
    if (cancelSubmitBtn) cancelSubmitBtn.addEventListener('click', hidePreviewModal);
    if (previewModalOverlay) previewModalOverlay.addEventListener('click', hidePreviewModal);

    // Feedback message display helper
    function showFeedback(type, msg) {
        const feedbackBox = document.getElementById('preview-form-message');
        if (!feedbackBox) return;
        feedbackBox.classList.remove('hidden');
        
        if (type === "success") {
            feedbackBox.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-green-400 bg-green-950/50 border border-green-800 p-3 rounded-lg">
                    <i data-lucide="check-circle" class="w-5 h-5 flex-shrink-0 text-green-400"></i>
                    <span class="font-medium text-left">${msg}</span>
                </div>
            `;
        } else {
            feedbackBox.innerHTML = `
                <div class="flex items-center justify-center space-x-2 text-red-400 bg-red-950/50 border border-red-800 p-3 rounded-lg">
                    <i data-lucide="alert-circle" class="w-5 h-5 flex-shrink-0 text-red-400"></i>
                    <span class="font-medium flex-grow text-left">${msg}</span>
                </div>
            `;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Modal Loading Spinner Manager
    const confirmSubmitBtn = document.getElementById('confirm-submit-btn');

    function setSubmissionLoading(isLoading) {
        const submitText = document.getElementById('confirm-submit-text');
        const submitSpinner = document.getElementById('confirm-submit-spinner');
        
        if (confirmSubmitBtn) confirmSubmitBtn.disabled = isLoading;
        if (cancelSubmitBtn) cancelSubmitBtn.disabled = isLoading;
        if (closePreviewBtn) closePreviewBtn.disabled = isLoading;
        
        if (isLoading) {
            if (submitText) submitText.classList.add('hidden');
            if (submitSpinner) submitSpinner.classList.remove('hidden');
        } else {
            if (submitText) submitText.classList.remove('hidden');
            if (submitSpinner) submitSpinner.classList.add('hidden');
        }
    }

    // 2. Final Confirmation Submit -> Google Apps Script POST
    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', async () => {
            if (!pendingPayload) {
                alert("No registration data found. Please fill in the form again.");
                return;
            }

            const scriptURL = eventScriptURLs['infosys-registration'];
            
            // --- Local Storage Mock logic for testing if URL is unconfigured ---
            if (!scriptURL || scriptURL.includes('YOUR_GOOGLE_SCRIPT_URL')) {
                setSubmissionLoading(true);
                
                setTimeout(() => {
                    const rollVal = pendingPayload.rollNumber;
                    const emailVal = pendingPayload.email.toLowerCase();
                    const phoneVal = pendingPayload.phone;
                    
                    let rolls = JSON.parse(localStorage.getItem('mock_reg_rolls_infosys') || '[]');
                    let emails = JSON.parse(localStorage.getItem('mock_reg_emails_infosys') || '[]');
                    let phones = JSON.parse(localStorage.getItem('mock_reg_phones_infosys') || '[]');
                    
                    if (rolls.includes(rollVal)) {
                        showFeedback("error", "Duplicate submission detected: This Roll Number has already registered.");
                        setSubmissionLoading(false);
                        return;
                    }
                    if (emails.includes(emailVal)) {
                        showFeedback("error", "Duplicate submission detected: This Email ID has already registered.");
                        setSubmissionLoading(false);
                        return;
                    }
                    if (phones.includes(phoneVal)) {
                        showFeedback("error", "Duplicate submission detected: This Phone Number has already registered.");
                        setSubmissionLoading(false);
                        return;
                    }
                    
                    // Save to mock storage
                    rolls.push(rollVal);
                    emails.push(emailVal);
                    phones.push(phoneVal);
                    localStorage.setItem('mock_reg_rolls_infosys', JSON.stringify(rolls));
                    localStorage.setItem('mock_reg_emails_infosys', JSON.stringify(emails));
                    localStorage.setItem('mock_reg_phones_infosys', JSON.stringify(phones));
                    
                    setSubmissionLoading(false);
                    showFeedback("success", "Registration Successful! PDF Certificate saved (Local Mock Test).");
                    if (infosysForm) infosysForm.reset();
                    
                    // Update buttons on success to allow manual close
                    confirmSubmitBtn.disabled = true;
                    const submitText = document.getElementById('confirm-submit-text');
                    if (submitText) submitText.innerText = "Registered ✅";
                    if (cancelSubmitBtn) cancelSubmitBtn.innerText = "Close Window";
                }, 1200);
                return;
            }

            setSubmissionLoading(true);

            // Timeout using AbortController (35 seconds for file uploads)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 35000);

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(pendingPayload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) throw new Error(`HTTP status error: ${response.status}`);

                const rawText = await response.text();
                let resData;
                try {
                    resData = JSON.parse(rawText);
                } catch (e) {
                    console.error("JSON parsing failed. Raw response was:", rawText);
                    throw new SyntaxError("Server response was not valid JSON. Ensure your Apps Script Web App access is set to 'Anyone'.");
                }

                if (resData.status === "success") {
                    setSubmissionLoading(false);
                    showFeedback("success", "Registration Successful! Your details and certificate have been recorded.");
                    if (infosysForm) infosysForm.reset();
                    
                    // Update buttons on success to allow manual close
                    confirmSubmitBtn.disabled = true;
                    const submitText = document.getElementById('confirm-submit-text');
                    if (submitText) submitText.innerText = "Registered ✅";
                    if (cancelSubmitBtn) cancelSubmitBtn.innerText = "Close Window";
                } else if (resData.status === "duplicate") {
                    showFeedback("error", resData.message || "Roll Number, Email, or Phone Number is already registered.");
                    setSubmissionLoading(false);
                } else {
                    showFeedback("error", resData.message || "Failed to submit registration. Please try again.");
                    setSubmissionLoading(false);
                }
            } catch (err) {
                clearTimeout(timeoutId);
                console.error("Submission failed:", err);
                let errMsg = "Unable to submit. Google Drive permission or Web App access issue in Apps Script.";
                if (err.name === 'AbortError') {
                    errMsg = "Submission timed out. File upload took longer than 35 seconds. Please try again.";
                } else if (err instanceof SyntaxError) {
                    errMsg = err.message;
                } else if (err.message && err.message.includes('Failed to fetch')) {
                    errMsg = "Network / Drive Authorization Error: 1) Open your Apps Script editor, select 'setupDrivePermissions' from the function menu and click 'Run' to grant Drive permissions. 2) Ensure deployment access is set to 'Anyone'.";
                } else if (err.message) {
                    errMsg = err.message;
                }
                showFeedback("error", errMsg);
                setSubmissionLoading(false);
            }
        });
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    attachNavbarLogic(); 
    lucide.createIcons();
    initNeuralNetwork();   
    initTiltEffect();      
    initEventsPage();      
});
