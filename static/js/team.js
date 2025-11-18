


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

/*****************************
 * ✅ Team Page Script
 *****************************/
//This finds the HTML container where the team cards will be inserted.
const teamGrid = document.getElementById("teamGrid");

// Team data — later we can move this to localStorage
//array of objects
const teamMembers = [
  { name: "Sofia", role: "UI/UX Designer", img: "https://i.pravatar.cc/50?img=1", status: "online" },
  { name: "Ali", role: "Frontend Developer", img: "https://i.pravatar.cc/50?img=2", status: "online" },
  { name: "Mira", role: "Project Manager", img: "https://i.pravatar.cc/50?img=3", status: "offline" },
  { name: "John", role: "Backend Developer", img: "https://i.pravatar.cc/50?img=4", status: "online" },
  { name: "Mike", role: "QA Engineer", img: "https://i.pravatar.cc/50?img=5", status: "offline" },
];


/* ---------- Render team grid ---------- */
function renderTeam() {
  teamGrid.innerHTML = teamMembers
    .map(member => {  //loops through the team list and produces a card for each member
      const dotColor = member.status === "online" ? "#2ecc71" : "#bbb";
      //This builds each team card:
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
    //Convert all cards into HTML
    .join("");
}

/* ---------- Init ---------- */
renderTeam();
