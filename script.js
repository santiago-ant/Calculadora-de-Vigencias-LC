document.getElementById('calculateBtn').addEventListener('click', function() {
    // Obtiene y convierte la fecha de nacimiento ingresada por el usuario
    const birthDate = new Date(document.getElementById('birthDate').value);
    // Obtiene y convierte la fecha de emisión ingresada por el usuario
    const issueDate = new Date(document.getElementById('issueDate').value);
    // Captura la categoría de licencia seleccionada por el usuario
    const category = document.getElementById('category').value;
    // Determina si la licencia es una renovación a partir del estado del checkbox
    const isRenewal = document.getElementById('isRenewal').checked;

    // Valida que todos los campos obligatorios estén completados antes de continuar
    if (!birthDate || !issueDate || !category) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Calcula la edad del solicitante al momento de la emisión de la licencia
    const ageAtIssue = Math.floor((issueDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    let expiryDate = new Date(issueDate); // Fecha de vencimiento calculada
    let ruleApplied = ''; // Variable para guardar la regla aplicada

    // Reglas específicas para menores de 16 años
    if (ageAtIssue < 16) {
        alert('No se permite emitir licencias para menores de 16 años.');
        return;
    }

    // Reglas específicas para solicitantes de 16 años
    if (ageAtIssue === 16 && category !== 'A') {
        alert('A los 16 años solo se permite la categoría A.');
        return;
    }

    // Reglas específicas para mayores de 65 años con categorías profesionales
    if (ageAtIssue >= 65 && (category === 'C' || category === 'D' || category === 'E')) {
        if (!isRenewal) {
            alert('No se pueden emitir nuevas licencias profesionales (C, D, E) a partir de los 65 años. Solo renovaciones están permitidas.');
            return;
        }
    }

    // Aplica reglas específicas para menores de 18 años
    if (ageAtIssue < 18) {
        if (category === 'A' || category === 'B') {
            if (ageAtIssue === 17) {
                if (isRenewal) {
                    // Vigencia de 3 años para renovaciones si tienen 17 años
                    expiryDate.setFullYear(issueDate.getFullYear() + 3);
                    ruleApplied = 'Menores de 18: 3 años para renovaciones si tienen 17 años.';
                } else {
                    // Vigencia de 1 año para primeras licencias si tienen 17 años
                    expiryDate.setFullYear(issueDate.getFullYear() + 1);
                    ruleApplied = 'Menores de 18: 1 año para primeras licencias si tienen 17 años.';
                }
            } else {
                // Vigencia de 1 año para menores de 18 años
                expiryDate.setFullYear(issueDate.getFullYear() + 1);
                ruleApplied = 'Menores de 18: 1 año.';
            }
        } else {
            alert('Los menores de 18 solo pueden tener categorías A o B.');
            return;
        }
    } else if (ageAtIssue >= 18 && ageAtIssue <= 20) {
        // Regla específica para solicitantes entre 18 y 20 años
        expiryDate.setFullYear(issueDate.getFullYear() + 3);
        ruleApplied = 'Entre 18 y 20: Máximo 3 años.';
    } else if (ageAtIssue < 65) {
        // Aplica reglas para solicitantes entre 21 y 65 años
        if (category === 'A' || category === 'B') {
            expiryDate.setFullYear(issueDate.getFullYear() + 5);
            if (expiryDate.getFullYear() > birthDate.getFullYear() + 65 + 3) {
                // Ajusta la vigencia para no exceder el límite de 65 años + 3 años
                expiryDate = new Date(birthDate.getFullYear() + 65 + 3, issueDate.getMonth(), issueDate.getDate());
            }
            ruleApplied = 'Entre 21 y 65: Máximo 5 años, ajustado al límite de 65+3 años.';
        } else {
            // Vigencia de 2 años si tiene menos de 45 años, 1 año si tiene más de 45
            expiryDate.setFullYear(issueDate.getFullYear() + (ageAtIssue < 45 ? 2 : 1));
            ruleApplied = 'Categorías profesionales menores de 65: 2 años si tiene menos de 45, 1 año si tiene más de 45.';
        }
    } else if (ageAtIssue < 70) {
        // Define reglas para solicitantes entre 65 y 70 años
        if (category === 'A' || category === 'B') {
            expiryDate.setFullYear(issueDate.getFullYear() + 3);
            if (expiryDate.getFullYear() > birthDate.getFullYear() + 70 + 1) {
                // Ajusta la vigencia para no exceder el límite de 70 años + 1 año
                expiryDate = new Date(birthDate.getFullYear() + 70 + 1, issueDate.getMonth(), issueDate.getDate());
            }
            ruleApplied = 'Entre 65 y 70: Máximo 3 años, ajustado al límite de 70+1 años.';
        } else {
            // Vigencia de 1 año para categorías profesionales mayores de 65
            expiryDate.setFullYear(issueDate.getFullYear() + 1);
            ruleApplied = 'Categorías profesionales mayores de 65: Máximo 1 año.';
        }
    } else {
        // Aplica reglas para solicitantes mayores de 70 años
        expiryDate.setFullYear(issueDate.getFullYear() + 1);
        ruleApplied = 'Mayores de 70: Máximo 1 año.';
    }

    // Muestra la edad del solicitante en la interfaz del usuario
    document.getElementById('age').textContent = `Edad al emitir: ${ageAtIssue} años`;
    // Muestra la fecha de vencimiento calculada en formato español
    document.getElementById('expiryDate').textContent = `Fecha de vencimiento: ${expiryDate.toLocaleDateString('es-ES')}`;
    // Muestra la regla aplicada según las condiciones del solicitante
    document.getElementById('ruleApplied').textContent = `Regla aplicada: ${ruleApplied}`;
});

// Agrega un mensaje de autor al diseño
const footer = document.createElement('footer');
footer.textContent = 'By Lucas Antunez ACTySSL';
footer.style.marginTop = '20px';
footer.style.fontSize = '0.9rem';
footer.style.color = '#555';
footer.style.textAlign = 'center';
footer.style.padding = '10px';
document.body.appendChild(footer);
