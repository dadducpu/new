function sanitizeInput(value) {
    if (value === null || typeof value === 'undefined') {
        return '';
    }

    return String(value)
        .trim()
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
}

function validateFormInput(type, value) {
    const cleanValue = sanitizeInput(value);

    switch (type) {
        case 'email': {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(cleanValue)) {
                return { valid: false, reason: 'Please enter a valid email address.' };
            }
            return { valid: true, reason: '' };
        }

        case 'name': {
            if (cleanValue.length < 2) {
                return { valid: false, reason: 'Name must be at least 2 characters long.' };
            }
            return { valid: true, reason: '' };
        }

        case 'message': {
            if (cleanValue.length < 10) {
                return { valid: false, reason: 'Please provide a bit more detail so we can help.' };
            }
            return { valid: true, reason: '' };
        }

        default:
            return { valid: true, reason: '' };
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const csrfField = document.getElementById('csrf_token');
    if (csrfField) {
        csrfField.value = 'grain-mortar-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    }
});
