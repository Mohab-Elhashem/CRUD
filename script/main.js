const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phoneNumber');
const emailInput = document.getElementById('emailAddress');
const addressInput = document.getElementById('address');
const textNotesInput = document.getElementById('textNotes');
const groupSelectInput = document.getElementById('groupSelect');

const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");

// Variable to store index during editing
let updateIndex = null;
// sweat alert


// Load Data from LocalStorage
let allNotes = [];
if (localStorage.getItem("notes") !== null) {
    allNotes = JSON.parse(localStorage.getItem("notes"));
}
displayAllNotes(allNotes);

// Add New Contact
function addNotes() {
    let name = fullNameInput.value.trim();
    let phone = phoneInput.value.trim();

    let nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;
    let phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!nameRegex.test(name)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name should contain only letters and spaces (2-50 characters)",
            confirmButtonText: "ok"
        });
        return;
    }
    if (!phoneRegex.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone Number",
            text: "Please enter a valid phone number (10 to 15 digits).",
            confirmButtonText: "OK"
        });
        return;
    }
    let notes = {
        fullName: name,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        textNotes: textNotesInput.value,
        groupSelect: groupSelectInput.value,
        isFavorite: false,
        isEmergency: false
    };

    allNotes.push(notes);
    localStorage.setItem("notes", JSON.stringify(allNotes));
    displayAllNotes(allNotes);
    clearInputs();

    Swal.fire({
        icon: "success",
        title: "Added Successfully!",
        showConfirmButton: false,
        timer: 1500
    });
}

// Display All Contacts
function displayAllNotes(notes) {
    const notesContainer = document.getElementById("notes");

    // Empty state view
    if (!notes || notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-secondary opacity-75">
                    <div class="empty-icon-bg bg-body-secondary mb-3 mx-auto">
                        <i class="fa-solid fa-address-book text-dark-emphasis fa-2x"></i>
                    </div>
                    <p class="text-muted mb-1">No contacts found</p>
                    <p class="small text-muted">Click "Add Contact" to get started</p>
                </div>
            </div>
        `;
        document.getElementById("total").innerHTML = 0;
        document.getElementById("favorites").innerHTML = 0;
        document.getElementById("emergency").innerHTML = 0;

        displayFavorites();
        displayEmergency();
        return;
    }

    // Render cards
    let htmlMarkup = "";
    for (let i = 0; i < notes.length; i++) {
        let relIndex = allNotes.indexOf(notes[i])
        const starClass = notes[i].isFavorite ? "fa-solid fa-star text-warning" : "fa-regular fa-star";
        const heartClass = notes[i].isEmergency ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";

        const showStarBadge = notes[i].isFavorite ? "d-flex" : "d-none";
        const showHeartBadge = notes[i].isEmergency ? "d-flex" : "d-none";

        htmlMarkup += `
            <div class="col-6">
                <div>
                    <div class="bg-white rounded-top-4 p-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="bg-blue rounded-3 d-flex align-items-center justify-content-center text-white p-2 position-relative"
                                style="width: 50px;height: 50px;">${(notes[i].fullName).trim().slice(0, 1).toUpperCase()}
                                <div class="${showStarBadge} position-absolute end-0 top-0 bg-warning rounded-circle justify-content-center align-items-center border border-2 small border-white" style="width:20px;height:20px;font-size:8px">
                                    <i class="fa-solid fa-star"></i>
                                </div>
                                <div class="${showHeartBadge} position-absolute end-0 bottom-0 bg-danger rounded-circle justify-content-center align-items-center border border-2 small border-white" style="width:20px;height:20px;font-size:8px">
                                    <i class="fa-solid fa-heart"></i>
                                </div>
                                </div>
                            <div>
                                <span id="nameInput" class="d-block fw-bold">${notes[i].fullName}</span>
                                <span class="text-secondary">
                                    <i class="fa-solid fa-phone blue bg-body-secondary p-2 rounded-3"></i>
                                    <span>${notes[i].phone}</span>
                                </span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-3 mt-3">
                            <i class="fa-solid fa-envelope blue p-2 bg-body-secondary rounded-3"></i>
                            <div class="text-secondary">${notes[i].email}</div>
                        </div>
                        <div class="d-flex align-items-center gap-3 mt-3">
                            <i class="fa-solid fa-location-dot text-success p-2 bg-info-subtle rounded-3"></i>
                            <div class="text-secondary">${notes[i].address}</div>
                        </div>
                        <div class="blue bg-body-secondary p-2 mt-3 rounded-3 w-auto d-inline-block">${notes[i].groupSelect}</div>
                    </div>
                    <footer class="text-secondary bg-light-gray border-top d-flex align-items-center justify-content-between px-3 py-2">
                        <div class="hov">
                            <i class="fa-solid fa-phone text-success bg-info-subtle p-2 rounded-3 cursor-pointer"></i>
                            <i class="fa-solid fa-envelope blue bg-info-subtle p-2 rounded-3 cursor-pointer"></i>
                        </div>
                        <div class="d-flex gap-3 hov">
                            <!-- أزرار المفضلة والطوارئ متصلة بالفانكشنز المباشرة -->
                            <i onclick="toggleFavorite(${i})" class="${starClass} cursor-pointer p-2 rounded-3"></i>
                            <i onclick="toggleEmergency(${i})" class="${heartClass} cursor-pointer p-2 rounded-3"></i>
                            <i onclick="setUpdateNote(${i})" class="fa-solid fa-pen cursor-pointer p-2 rounded-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                            <i onclick="deleteNote(${relIndex})" class="fa-solid fa-trash cursor-pointer p-2 rounded-3"></i>
                        </div>
                    </footer>
                </div>
            </div>
        `;
    }

    const favCount = notes.filter(n => n.isFavorite).length;
    const emergencyCount = notes.filter(n => n.isEmergency).length;

    document.getElementById("total").innerHTML = notes.length;
    document.getElementById("favorites").innerHTML = favCount;
    document.getElementById("emergency").innerHTML = emergencyCount;

    notesContainer.innerHTML = htmlMarkup;

    const modalElement = document.getElementById('staticBackdrop');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }

    displayFavorites();
    displayEmergency();
}

// Toggle Favorite Status 
function toggleFavorite(index) {
    allNotes[index].isFavorite = !allNotes[index].isFavorite;
    localStorage.setItem("notes", JSON.stringify(allNotes));
    displayAllNotes(allNotes);
}

// Toggle Emergency Status
function toggleEmergency(index) {
    allNotes[index].isEmergency = !allNotes[index].isEmergency;
    localStorage.setItem("notes", JSON.stringify(allNotes));
    displayAllNotes(allNotes);
}

// Display Favorites Side Container
function displayFavorites() {
    const favoritesContainer = document.getElementById("favoritesList");
    if (!favoritesContainer) return;

    const favoriteNotes = allNotes.filter(note => note.isFavorite);

    if (favoriteNotes.length === 0) {
        favoritesContainer.innerHTML = `<p class="text-muted small text-center my-3">No favorites yet</p>`;
        return;
    }

    let htmlMarkup = "";
    for (let i = 0; i < favoriteNotes.length; i++) {
        htmlMarkup += `
            <div class="favorite d-flex align-items-center justify-content-between bg-body-tertiary p-2 rounded-3 mb-2 cursor-pointer">
                <div class="d-flex gap-2 align-items-center">
                    <div class="bg-blue p-2 rounded-3 text-white d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                        ${favoriteNotes[i].fullName.trim().slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <div class="fw-bold fs-6">${favoriteNotes[i].fullName}</div>
                        <div class="text-secondary small">${favoriteNotes[i].phone}</div>
                    </div>
                </div>
                <div>
                        <i class="fa-solid fa-phone text-success bg-info-subtle p-2 rounded-3 "></i>
                </div>
            </div>
        `;
    }

    favoritesContainer.innerHTML = htmlMarkup;
}

// Display Emergency Side Container
function displayEmergency() {
    const emergencyContainer = document.getElementById("emergencyList");
    if (!emergencyContainer) return;

    const emergencyNotes = allNotes.filter(note => note.isEmergency);

    if (emergencyNotes.length === 0) {
        emergencyContainer.innerHTML = `<p class="text-muted small text-center my-3">No emergency contacts</p>`;
        return;
    }

    let htmlMarkup = "";
    for (let i = 0; i < emergencyNotes.length; i++) {
        htmlMarkup += `
            <div class="emergency d-flex align-items-center justify-content-between bg-body-tertiary p-2 rounded-3 mb-2 cursor-pointer">
                <div class="d-flex gap-2 align-items-center">
                    <div class="bg-danger p-2 rounded-3 text-white d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                        ${emergencyNotes[i].fullName.trim().slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <div class="fw-bold fs-6">${emergencyNotes[i].fullName}</div>
                        <div class="text-secondary small">${emergencyNotes[i].phone}</div>
                    </div>
                </div>
                <div>
                    <i class="fa-solid fa-phone text-danger bg-danger-subtle p-2 rounded-3 "></i>
                </div>
            </div>
        `;
    }

    emergencyContainer.innerHTML = htmlMarkup;
}

// Delete Contact
function deleteNote(index) {
    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete MoHaP? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            allNotes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(allNotes));
            displayAllNotes(allNotes);
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

        }
    });
}

// Prepare Data for Updating
function setUpdateNote(index) {
    updateIndex = index;
    fullNameInput.value = allNotes[index].fullName;
    phoneInput.value = allNotes[index].phone;
    emailInput.value = allNotes[index].email;
    addressInput.value = allNotes[index].address;
    textNotesInput.value = allNotes[index].textNotes;
    groupSelectInput.value = allNotes[index].groupSelect;

    addBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

// Update Action
function updateNote() {
    let updatedNote = {
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        textNotes: textNotesInput.value,
        groupSelect: groupSelectInput.value,
        isFavorite: allNotes[updateIndex].isFavorite || false,
        isEmergency: allNotes[updateIndex].isEmergency || false
    };

    allNotes.splice(updateIndex, 1, updatedNote);
    localStorage.setItem("notes", JSON.stringify(allNotes));
    displayAllNotes(allNotes);
    clearInputs();
}

// Clear Form & Reset Buttons
function clearInputs() {
    fullNameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    addressInput.value = "";
    textNotesInput.value = "";
    groupSelectInput.value = "";

    updateIndex = null;
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
}

// search
function search(term) {
    let filterNote = allNotes.filter(function (note) {
        return note.fullName.toLowerCase().includes(term.toLowerCase())
    })
    displayAllNotes(filterNote)

}

// name Validation
function nameValidation(value) {
    let nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{2,50}$/;
    let alertBox = document.getElementById("nameValidation");
    if (value.trim() === "") {
        alertBox.innerHTML = "";
        return false;
    }
    if (!nameRegex.test(value)) {
        alertBox.innerHTML = "Name should contain only letters and spaces (2-50 characters)";
        return false;
    } else {
        alertBox.innerHTML = "";
        return true;
    }
}
// phoneValidation
function phoneValidation(value) {
    let phoneRegex = /^\+?[0-9]{10,15}$/;
    let alertBox = document.getElementById("phoneValidation");
    if (value.trim() === "") {
        alertBox.innerHTML = "Please enter a phone number.";
        return false;
    }
    if (!phoneRegex.test(value.trim())) {
        alertBox.innerHTML = "Please enter a valid Egyptian phone number";
        return false;
    } else {
        alertBox.innerHTML = "";
        return true;
    }
}