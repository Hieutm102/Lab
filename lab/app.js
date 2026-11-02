
import {
    diemTrungBinh,
    layTen,
    xepLoai,
    nhomTheoLop,
    top
} from './js.js';

// Initial student data
let students = [
    { name: 'An', class: 'Web1', score: 8 },
    { name: 'Bình', class: 'Web2', score: 9 },
    { name: 'Chi', class: 'Web1', score: 6 },
    { name: 'Dũng', class: 'Web2', score: 9 },
    { name: 'Hà', class: 'Web1', score: 4 }
];

// Get HTML elements
const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const classInput = document.getElementById('className');
const scoreInput = document.getElementById('score');
const topInput = document.getElementById('topNumber');

// Escape HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

// Show error
function showError(input, errorId, message) {
    input.classList.remove('valid');
    input.classList.add('invalid');

    input.setAttribute('aria-invalid', 'true');

    document.getElementById(errorId).textContent = message;
}

// Show valid
function showValid(input, errorId) {
    input.classList.remove('invalid');
    input.classList.add('valid');

    input.setAttribute('aria-invalid', 'false');

    document.getElementById(errorId).textContent = '';
}

// Normalize text
function normalizeText(value) {
    return value.trim()
        .normalize('NFC')
        .toLocaleLowerCase('vi');
}

// 1. Validate name
function validateName() {
    const name = nameInput.value.trim().normalize('NFC');

    if (!name) {
        showError(nameInput, 'nameError',
            'Student name is required.');
        return false;
    }

    if (name.length < 2 || name.length > 50) {
        showError(nameInput, 'nameError',
            'Name must contain 2-50 characters.');
        return false;
    }

    const pattern = /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u;

    if (!pattern.test(name)) {
        showError(nameInput, 'nameError',
            'Name can only contain letters, spaces, apostrophes and hyphens.');
        return false;
    }

    showValid(nameInput, 'nameError');
    return true;
}

// 2. Validate class
function validateClass() {
    const className = classInput.value.trim().normalize('NFC');

    if (!className) {
        showError(classInput, 'classError',
            'Class is required.');
        return false;
    }

    if (className.length < 2 || className.length > 20) {
        showError(classInput, 'classError',
            'Class must contain 2-20 characters.');
        return false;
    }

    if (!/^[\p{L}\p{N}_-]+$/u.test(className)) {
        showError(classInput, 'classError',
            'Only letters, numbers, - and _ are allowed.');
        return false;
    }

    showValid(classInput, 'classError');
    return true;
}

// 3. Validate score
function validateScore() {
    const value = scoreInput.value.trim();
    const score = Number(value);

    if (!value) {
        showError(scoreInput, 'scoreError',
            'Score is required.');
        return false;
    }

    if (!Number.isFinite(score)) {
        showError(scoreInput, 'scoreError',
            'Please enter a valid number.');
        return false;
    }

    if (score < 0 || score > 10) {
        showError(scoreInput, 'scoreError',
            'Score must be between 0 and 10.');
        return false;
    }

    if (!/^\d+(\.\d)?$/.test(value)) {
        showError(scoreInput, 'scoreError',
            'Score can have at most 1 decimal place.');
        return false;
    }

    showValid(scoreInput, 'scoreError');
    return true;
}

// 4. Check duplicate student
function isDuplicateStudent(name, className) {
    return students.some(sv =>
        normalizeText(sv.name) === normalizeText(name) &&
        normalizeText(sv.class) === normalizeText(className)
    );
}

// 5. Display students
function displayStudents(ds = students) {
    document.getElementById('studentTable').innerHTML =
        ds.map((sv, index) => {
            const grade = xepLoai(sv.score);

            const gradeClass = sv.score >= 8
                ? 'good'
                : sv.score >= 5
                    ? 'average'
                    : 'weak';

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHTML(sv.name)}</td>
                    <td>${escapeHTML(sv.class)}</td>
                    <td>${sv.score}</td>
                    <td>
                        <span class="grade ${gradeClass}">
                            ${grade}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
}

// 6. Update statistics
function updateStatistics() {
    document.getElementById('totalStudents').textContent =
        students.length;

    document.getElementById('averageScore').textContent =
        diemTrungBinh(students).toFixed(2);

    document.getElementById('highestScore').textContent =
        students.length
            ? Math.max(...students.map(sv => sv.score))
            : 0;
}

// 7. Show message
function showMessage(message, type) {
    const element = document.getElementById('formMessage');

    element.textContent = message;
    element.className = `form-message ${type}`;
}

// 8. Add student
studentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const validName = validateName();
    const validClass = validateClass();
    const validScore = validateScore();

    if (!validName || !validClass || !validScore) {
        showMessage('Please correct the errors!', 'error');
        return;
    }

    const name = nameInput.value.trim().normalize('NFC');
    const className = classInput.value.trim().normalize('NFC');
    const score = Number(scoreInput.value);

    if (isDuplicateStudent(name, className)) {
        showError(nameInput, 'nameError',
            'This student already exists in this class.');

        showMessage('Duplicate student detected!', 'error');
        return;
    }

    students = [
        ...students,
        { name, class: className, score }
    ];

    displayStudents();
    updateStatistics();

    studentForm.reset();

    [nameInput, classInput, scoreInput].forEach(input => {
        input.classList.remove('valid', 'invalid');
        input.removeAttribute('aria-invalid');
    });

    ['nameError', 'classError', 'scoreError'].forEach(id => {
        document.getElementById(id).textContent = '';
    });

    showMessage('Student added successfully!', 'success');
});

// 9. Real-time validation
nameInput.addEventListener('input', validateName);
classInput.addEventListener('input', validateClass);
scoreInput.addEventListener('input', validateScore);

// 10. Sort names
document.getElementById('showNames').addEventListener('click', () => {
    const names = layTen(students);

    document.getElementById('result').innerHTML = `
        <h3>Student Names (Vietnamese Order)</h3>
        ${names.length
            ? `<ul>${names.map(name =>
                `<li>${escapeHTML(name)}</li>`
            ).join('')}</ul>`
            : '<p>No students available.</p>'
        }
    `;
});

// 11. Group students
document.getElementById('groupStudents').addEventListener('click', () => {
    const groups = nhomTheoLop(students);

    document.getElementById('result').innerHTML =
        Object.entries(groups).map(([className, list]) => `
            <h3>${escapeHTML(className)}</h3>
            <ul>
                ${list.map(sv => `
                    <li>${escapeHTML(sv.name)} - Score: ${sv.score}</li>
                `).join('')}
            </ul>
        `).join('') || '<p>No students available.</p>';
});

// 12. Top students

document.getElementById('showTop').addEventListener('click', () => {

    const value = topInput.value.trim();
    const n = Number(value);

    // Check empty or invalid number
    if (!value || !Number.isInteger(n) || n < 1) {
        showError(
            topInput,
            'topError',
            'Enter a positive whole number.'
        );
        return;
    }

    // Check whether N exceeds student count
    if (n > students.length) {
        showError(
            topInput,
            'topError',
            `Only ${students.length} students are available.`
        );
        return;
    }

    // Clear errors
    showValid(topInput, 'topError');

    // Get top students
    const topStudents = top(students, n);

    // Display results
    document.getElementById('result').innerHTML = `
        <h3>Top ${n} Students</h3>
        <ul>
            ${topStudents.map((sv, index) => `
                <li>
                    ${index + 1}. ${escapeHTML(sv.name)}
                    - ${escapeHTML(sv.class)}
                    - Score: ${sv.score}
                </li>
            `).join('')}
        </ul>
    `;
});

// Initial display
displayStudents();
updateStatistics();
