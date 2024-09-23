

// script.js

// Load baby names from localStorage or initialize an empty array
function loadNames() {
    const babyNames = JSON.parse(localStorage.getItem('babyNames')) || [];
    const nameList = document.getElementById('name-list');
    if (nameList) {
        nameList.innerHTML = '';
        babyNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            nameList.appendChild(li);
        });
    }
}

// Add a new baby name to localStorage (Admin Functionality)
function addName(name) {
    let babyNames = JSON.parse(localStorage.getItem('babyNames')) || [];
    if (babyNames.includes(name)) {
        alert('This name already exists!'); // Prevent duplicate names
        return;
    }
    babyNames.push(name);
    localStorage.setItem('babyNames', JSON.stringify(babyNames));
    loadNames(); // Reload names after adding a new one
    alert(`Successfully added "${name}" to the list!`); // Confirmation message
}

// Load baby names for voting (Participant Functionality)
function loadNamesForVoting() {
    const babyNames = JSON.parse(localStorage.getItem('babyNames')) || [];
    const voteList = document.getElementById('vote-list');
    voteList.innerHTML = '';

    babyNames.forEach(name => {
        const li = document.createElement('li');
        li.innerHTML = `${name} <button class="vote-btn" data-name="${name}">Vote</button>`;
        voteList.appendChild(li);
    });

    // Attach event listeners to vote buttons
    document.querySelectorAll('.vote-btn').forEach(button => {
        button.addEventListener('click', function () {
            vote(this.getAttribute('data-name'));
        });
    });
}

// Handle participant login
function login(name) {
    const votingSection = document.getElementById('voting-section');
    const participantName = name.trim();

    if (participantName) {
        sessionStorage.setItem('participantName', participantName); // Store name

        if (!hasVoted(participantName)) {
            votingSection.style.display = 'block';
            document.getElementById('error-message').textContent = '';
        } else {
            document.getElementById('error-message').textContent = 'You have already voted!';
        }
    }
}

// Check if a participant has voted
function hasVoted(participantName) {
    const votes = JSON.parse(localStorage.getItem('votes')) || {};
    return votes[participantName] ? true : false;
}

// Vote for a baby name (Participant Functionality)
function vote(name) {
    const participantName = sessionStorage.getItem('participantName');
    if (participantName && !hasVoted(participantName)) {
        const votes = JSON.parse(localStorage.getItem('votes')) || {};
        votes[participantName] = name;
        localStorage.setItem('votes', JSON.stringify(votes));

        // Confirmation and visual feedback
        alert(`Thank you, ${participantName}! You have voted for "${name}".`);
        loadNamesForVoting();
        displayResults();
    } else {
        alert('You are not allowed to vote again!');
    }
}

// Display vote results (who voted for what and total votes)
function displayResults() {
    const votes = JSON.parse(localStorage.getItem('votes')) || {};
    const voteResults = document.getElementById('vote-results');
    voteResults.innerHTML = '';

    // Count the total votes for each name
    const voteCounts = {};

    for (let participant in votes) {
        const votedName = votes[participant];
        voteCounts[votedName] = voteCounts[votedName] ? voteCounts[votedName] + 1 : 1;
    }

    // Display the voting results
    const babyNames = JSON.parse(localStorage.getItem('babyNames')) || [];
    babyNames.forEach(name => {
        const li = document.createElement('li');
        li.textContent = `${name} - ${voteCounts[name] || 0} votes`;
        voteResults.appendChild(li);
    });

    // Show who voted for which name
    for (let participant in votes) {
        const li = document.createElement('li');
        li.textContent = `${participant} voted for ${votes[participant]}`;
        li.classList.add('voted');
        voteResults.appendChild(li);
    }
}
