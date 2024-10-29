function displayRankings() {
    // Retrieve scores from localStorage
    const scores = JSON.parse(localStorage.getItem("scores")) || {};
    console.log("Retrieved scores:", scores); // Debug log

    // Create rankings array from scores
    const rankings = Object.entries(scores)
        .map(([username, score]) => ({ username, score }))
        .sort((a, b) => b.score - a.score);

    // Get the table body for rankings
    const rankingsTableBody = document.getElementById("rankingsTableBody");

    // Check if the table body exists
    if (!rankingsTableBody) {
        console.error("Rankings table body not found.");
        return;
    }

    // Clear existing rankings
    rankingsTableBody.innerHTML = ""; 

    // Check if there are rankings to display
    if (rankings.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = "<td colspan='2'>No rankings available.</td>"; // Display message if no rankings
        rankingsTableBody.appendChild(row);
        return;
    }

    // Populate table with rankings
    rankings.forEach(rank => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${rank.username}</td><td>${rank.score}</td>`;
        rankingsTableBody.appendChild(row);
    });
}

// Call displayRankings() when the document is loaded
document.addEventListener("DOMContentLoaded", displayRankings);
