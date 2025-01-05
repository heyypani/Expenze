const members = [];
const balances = {};

document.getElementById('add-member').addEventListener('click', () => {
    const memberName = document.getElementById('member-name').value.trim();
    if (memberName && !members.includes(memberName)) {
        members.push(memberName);
        balances[memberName] = 0;
        updateMembersList();
        updatePayerSelect();
        document.getElementById('member-name').value = '';
    } else {
        alert('Member name is empty or already exists!');
    }
});

document.getElementById('add-expense').addEventListener('click', () => {
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const payer = document.getElementById('payer-select').value;

    if (description && amount > 0 && payer) {
        const splitAmount = amount / members.length;
        members.forEach(member => {
            balances[member] -= splitAmount; // Subtract each member's share
        });
        balances[payer] += amount; // Add the payer's contribution

        document.getElementById('expense-description').value = '';
        document.getElementById('expense-amount').value = '';
    } else {
        alert('Invalid expense details!');
    }
});

document.getElementById('settle-balances').addEventListener('click', () => {
    const settlementList = document.getElementById('settlement-list');
    const settlements = calculateSettlements();

    if (settlements.length > 0) {
        settlementList.innerHTML = settlements
            .map(settlement => `<li>${settlement}</li>`)
            .join('');
    } else {
        settlementList.innerHTML = '<li>No settlements required</li>';
    }
});

function updateMembersList() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = members.map(member => `<li>${member}</li>`).join('');
}

function updatePayerSelect() {
    const payerSelect = document.getElementById('payer-select');
    payerSelect.innerHTML = members.map(member => `<option value="${member}">${member}</option>`).join('');
}

function calculateSettlements() {
    const debts = [];
    const credits = [];

    // Separate debts and credits
    for (const [member, balance] of Object.entries(balances)) {
        if (balance < 0) {
            debts.push({ member, amount: -balance }); // Store as positive debt
        } else if (balance > 0) {
            credits.push({ member, amount: balance }); // Store positive credits
        }
    }

    console.log('Debts:', debts);
    console.log('Credits:', credits);

    // Calculate settlements
    const settlements = [];
    while (debts.length > 0 && credits.length > 0) {
        const debtor = debts[0];
        const creditor = credits[0];

        const settlementAmount = Math.min(debtor.amount, creditor.amount);
        settlements.push(`${debtor.member} pays ${creditor.member} ${settlementAmount.toFixed(2)}`);

        debtor.amount -= settlementAmount;
        creditor.amount -= settlementAmount;

        if (debtor.amount === 0) debts.shift(); // Remove debtor if fully settled
        if (creditor.amount === 0) credits.shift(); // Remove creditor if fully settled
    }

    return settlements;
}
