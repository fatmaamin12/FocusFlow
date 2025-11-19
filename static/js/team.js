if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.addEventListener("DOMContentLoaded", () => {
  const teamGrid = document.getElementById("teamGrid");  

  // If this page doesn't have teamGrid → stop safely
  if (!teamGrid) return;

  const teamMembers = [
    { name: "Sofia", role: "UI/UX Designer", img: "https://i.pravatar.cc/50?img=1", status: "online" },
    { name: "Ali", role: "Frontend Developer", img: "https://i.pravatar.cc/50?img=2", status: "online" },
    { name: "Mira", role: "Project Manager", img: "https://i.pravatar.cc/50?img=3", status: "offline" },
    { name: "John", role: "Backend Developer", img: "https://i.pravatar.cc/50?img=4", status: "online" },
    { name: "Mike", role: "QA Engineer", img: "https://i.pravatar.cc/50?img=5", status: "offline" },
  ];

  function renderTeam() {
    teamGrid.innerHTML = teamMembers
      .map(member => {
        const dotColor = member.status === "online" ? "#2ecc71" : "#bbb";
        return `
          <div class="team-card">
            <img src="${member.img}" alt="${member.name}">
            <div class="team-info">
              <h4>
                ${member.name}
                <span class="status-dot" style="background:${dotColor}"></span>
              </h4>
              <p>${member.role}</p>
            </div>
          </div>
        `;
      })
      .join("");
  }

  renderTeam();
});
