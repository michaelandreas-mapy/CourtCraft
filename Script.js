// ==========================================
// Ambil elemen HTML
// ==========================================
const ovrDisplay = document.getElementById('ovr-display');
const nbaPlayerDisplay = document.getElementById('nba-player');
const pointsDisplay = document.getElementById('points-display');
const archetypeSelect = document.getElementById('archetype-select');
const btnRollPoints = document.getElementById('btn-roll-points');
const cardGrade = document.getElementById('card-grade');
const accDisplay = document.getElementById('acc-display');
const fotopemain = document.getElementById('player-image');

// Elemen dan Variabel Tambahan untuk Scouting Report
const playerDescDisplay = document.getElementById('player-description');
let typeWriterTimeout;
let lastMatchedPlayer = "";

const scoutingReportBox = document.getElementById('scouting-report-box');
const scoutingReportTitle = document.getElementById('scouting-report-title');

// ==========================================
// Data archetype sama database nama file gambar pemain
// ==========================================
const archetypes = {
    "sharpshooter": {
        base: { finishing: 60, speed: 70, shooting: 85, playmaking: 70, defense: 60 },
        max: { finishing: 75, speed: 85, shooting: 99, playmaking: 80, defense: 70 }
    },
    "slasher": {
        base: { finishing: 85, speed: 85, shooting: 60, playmaking: 70, defense: 65 },
        max: { finishing: 99, speed: 95, shooting: 75, playmaking: 80, defense: 80 }
    },
    "lockdown": {
        base: { finishing: 65, speed: 75, shooting: 60, playmaking: 65, defense: 85 },
        max: { finishing: 80, speed: 85, shooting: 70, playmaking: 75, defense: 99 }
    },
    "playmaker": {
        base: { finishing: 70, speed: 80, shooting: 70, playmaking: 85, defense: 65 },
        max: { finishing: 80, speed: 95, shooting: 80, playmaking: 99, defense: 75 }
    }
};

// database foto untuk nampilin gambar pemain
const databasefoto = {
    "Stephen Curry": "Curry.png",
    "Luka Doncic": "Luka.png",
    "Giannis Antetokounmpo": "Giannis.png",
    "Bam Adebayo": "Bam.png",
    "De'Aaron Fox": "Fox.png",
    "Marcus Smart": "Smart.png",
    "Klay Thompson": "Klay.png",
    "Tyrese Haliburton": "Haliburton.png",
    "Matisse Thybulle": "Thybulle.png",
    "Alex Caruso": "Caruso.png",
    "Duncan Robinson": "Robinson.png",
    "Kyle Korver": "Korver.png",
    "Derrick Jones Jr.": "Jones.png",

    "General 3PT Specialist": "Genericshoot.png",
    "General Defensive Stopper": "Genericdef.png",
    "General Point Guard": "Genericpg.png",
    "General Inside Finisher": "Genericfinisher.png",
};

// Database scouting report
const descriptionDatabase = {
    "Stephen Curry": "Mematikan dari luar garis 3 angka. Bergerak tanpa bola dengan lincah untuk merusak fokus pertahanan. Mampu menciptakan tembakan sendiri dengan cepat.",
    "Luka Doncic": "Sangat cerdas mengontrol tempo. Mampu mencetak poin dan membagikan umpan magis meski dijaga ketat. Bermain dengan ritme yang sulit ditebak lawan.",
    "Giannis Antetokounmpo": "Mendominasi area dalam dengan perpaduan tenaga fisik, kecepatan transisi, dan langkah panjang yang tak terhentikan.",
    "Bam Adebayo": "Pondasi pertahanan yang solid. Cepat saat rotasi menjaga lawan dan andal sebagai penyalur bola di area post.",
    "De'Aaron Fox": "Mengandalkan kecepatan kilat. Sangat berbahaya dalam serangan balik dan ahli menembus pertahanan menuju ring.",
    "Marcus Smart": "Bermain dengan intensitas tinggi. Tidak takut melakukan hustle play kotor demi mencuri bola dari tangan lawan.",
    "Klay Thompson": "Tidak butuh lama memegang bola. Begitu menerima umpan, tembakannya langsung meluncur tajam dan akurat.",
    "Tyrese Haliburton": "Seorang jenderal lapangan sejati. Visi umpannya selangkah lebih maju dari pertahanan lawan.",
    "Matisse Thybulle": "Mimpi buruk bagi pencetak poin lawan. Memiliki insting luar biasa untuk menepis tembakan dan memotong jalur umpan.",
    "Alex Caruso": "Energi yang tak ada habisnya. Bermain sangat cerdas dalam membaca pergerakan lawan dan sering melakukan steal krusial.",
    "Duncan Robinson": "Pakar berlari mengelilingi pemain besar (screen) hanya untuk mendapatkan ruang sekecil apa pun untuk menembak.",
    "Kyle Korver": "Legenda spesialis catch-and-shoot. Jika dibiarkan bebas sedikit saja di perimeter, itu sama dengan poin gratis.",
    "Derrick Jones Jr.": "Sangat atletis. Melayang di udara untuk menyelesaikan umpan alley-oop atau melakukan blok spektakuler.",
    "General 3PT Specialist": "Fokus utamanya adalah membuka jarak pertahanan lawan dengan ancaman tembakan luar yang mematikan.",
    "General Defensive Stopper": "Tugas utamanya hanya satu: Menempel ketat dan mematikan pemain terbaik dari tim lawan.",
    "General Point Guard": "Pengatur ritme. Fokus pada penguasaan bola dan mendistribusikan umpan yang tepat.",
    "General Inside Finisher": "Tidak peduli dengan tembakan jauh. Hanya mencari poin pasti di area dekat ring.",
    "Bench Warmer": "Masih butuh banyak sesi latihan sebelum pelatih mempercayakan menit bermain di lapangan utama."
};

const playerCard = document.getElementById('player-card'); 

let currentArchetype = null;
let availablePoints = 0;
let rollsLeft = 3; 

const statList = ['finishing', 'speed', 'shooting', 'playmaking', 'defense'];

// ==========================================
// Logika kalkulator pemain
// ==========================================

// nentuin pemain NBA yang cocok berdasarkan stats
function determinePlayerMatch(finishing, speed, shooting, playmaking, defense) {
    // --- superstar ---
    if (shooting >= 95 && playmaking >= 75 && speed >= 80) return "Stephen Curry (Offensive Threat)";
    else if (playmaking >= 95 && finishing >= 75 && shooting >= 75) return "Luka Doncic (Offensive Initiator)";
    else if (finishing >= 95 && speed >= 85 && defense >= 75) return "Giannis Antetokounmpo (2-Way Slasher)";
    else if (defense >= 95 && finishing >= 75 && playmaking >= 70) return "Bam Adebayo (Versatile Anchor)";
    
    // --- elite ---
    else if (speed >= 90 && playmaking >= 85 && finishing >= 75) return "De'Aaron Fox (Slashing Playmaker)";
    else if (defense >= 90 && playmaking >= 70 && shooting >= 65) return "Marcus Smart (Perimeter Lockdown)";
    else if (shooting >= 90 && defense >= 70 && speed >= 75) return "Klay Thompson (3-and-D Wing)";
    else if (playmaking >= 90 && shooting >= 75 && speed >= 80) return "Tyrese Haliburton (Elite Floor General)";
    
    // --- role player ---
    else if (defense >= 90 && speed >= 80 && shooting < 65) return "Matisse Thybulle (Defensive Menace)";
    else if (defense >= 85 && speed >= 80 && playmaking >= 70) return "Alex Caruso (Hustle Defender)";
    else if (shooting >= 90 && playmaking >= 70 && defense < 70) return "Duncan Robinson (Pure Sharpshooter)";
    else if (shooting >= 88 && speed < 75 && defense < 70) return "Kyle Korver (Catch & Shoot Specialist)";
    else if (finishing >= 90 && speed >= 85 && defense >= 70) return "Derrick Jones Jr. (High-Flying Finisher)";
    
    // --- generik ---
    else if (shooting >= 80 && playmaking >= 70 && defense < 75) return "General 3PT Specialist";
    else if (defense >= 80 && speed >= 75 && shooting < 75) return "General Defensive Stopper";
    else if (playmaking >= 80 && speed >= 80 && finishing < 80) return "General Point Guard";
    else if (finishing >= 80 && speed >= 80 && shooting < 75) return "General Inside Finisher";
    
    return "Bench Warmer (Undrafted)";
}

// update foto pemain yang cocok
function updatePlayerVisuals(fullPlayerName) {
    const playerName = fullPlayerName.split(" (")[0]; 
    if (databasefoto[playerName]) {
        fotopemain.src = `Foto/${databasefoto[playerName]}`;
        fotopemain.style.display = "block";
    } else {
        fotopemain.style.display = "none"; 
    }
}

// update grade kartu dari OVR
function updateCardGrade(ovr) {
    cardGrade.className = 'card-grade'; 
    let themeColor = ""; 

    if (ovr >= 95) {
        cardGrade.textContent = "DIAMOND";
        cardGrade.classList.add('grade-pristine');
        themeColor = "#00ffff"; 
        playerCard.style.boxShadow = "0 0 30px rgba(0, 255, 255, 0.6)"; 
    } else if (ovr >= 90) {
        cardGrade.textContent = "AMETHYST";
        cardGrade.classList.add('grade-mint');
        themeColor = "#9b59b6"; 
        playerCard.style.boxShadow = "0 0 30px rgba(155, 89, 182, 0.6)"; 
    } else if (ovr >= 85) {
        cardGrade.textContent = "RUBY";
        cardGrade.classList.add('grade-nm');
        themeColor = "#e74c3c"; 
        playerCard.style.boxShadow = "0 0 30px rgba(231, 76, 60, 0.6)"; 
    } else if (ovr >= 80) {
        cardGrade.textContent = "SAPPHIRE";
        cardGrade.classList.add('grade-ex');
        themeColor = "#2980b9"; 
        playerCard.style.boxShadow = "0 0 30px rgba(41, 128, 185, 0.6)"; 
    } else if (ovr >= 70) {
        cardGrade.textContent = "GOLD";
        cardGrade.classList.add('grade-vg');
        themeColor = "#f1c40f"; 
        playerCard.style.boxShadow = "0 0 30px rgba(241, 196, 15, 0.6)"; 
    } else {
        cardGrade.textContent = "BRONZE";
        cardGrade.classList.add('grade-ungraded');
        themeColor = "#cd7f32"; 
        playerCard.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.8)"; 
    }

    // Terapkan warna ke border Kartu Pemain
    playerCard.style.borderColor = themeColor;
    
    // Terapkan warna yang sama ke Scouting Report
    scoutingReportBox.style.borderLeftColor = themeColor;
    scoutingReportTitle.style.color = themeColor;
}

// Fungsi Animasi Mesin Ketik (Typewriter Effect)
function typeWriterEffect(text, element) {
    element.textContent = ""; 
    clearTimeout(typeWriterTimeout); 
    
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            typeWriterTimeout = setTimeout(type, 20); // 20ms per huruf
        }
    }
    type();
}

// fungsi untuk menghitung ovr berdasarkan stats yang diinput
function calculateStats() {
    const finskor = parseInt(document.getElementById('finishing').value);
    const speedskor = parseInt(document.getElementById('speed').value);
    const shootskor = parseInt(document.getElementById('shooting').value);
    const playskor = parseInt(document.getElementById('playmaking').value);
    const defskor = parseInt(document.getElementById('defense').value);
    
    // ngitung total poin stats yang diinput user
    const currentTotal = finskor + speedskor + shootskor + playskor + defskor;
    
    // ngitung total poin atribut dasar archetype yang dipilih
    const baseTotal = currentArchetype.base.finishing + currentArchetype.base.speed + 
                      currentArchetype.base.shooting + currentArchetype.base.playmaking + 
                      currentArchetype.base.defense;
                      
    // nentuin berapa poin yang ditambahkan dari gacha roll
    const pointsAdded = currentTotal - baseTotal;

    // kalo usernya hoki 50 poin spin : 75 + (50 * 0.48) = 75 + 24 = 99 
    let average = Math.round(75 + (pointsAdded * 0.48));
    
    // kunci batas max 99
    if (average > 99) {
        average = 99;
    }

    ovrDisplay.textContent = average;

    const playerMatch = determinePlayerMatch(finskor, speedskor, shootskor, playskor, defskor);
    let nameOnly = playerMatch;

    if (playerMatch.includes(" (")) {
        const parts = playerMatch.split(" (");
        nameOnly = parts[0]; 
        const styleOnly = parts[1].replace(")", ""); 
        
        // tambah elemen untuk nampilin style pemain di bawah nama pemain
        nbaPlayerDisplay.innerHTML = `${nameOnly}<br><span class="player-archetype">${styleOnly}</span>`;
    } else {
        nbaPlayerDisplay.innerHTML = playerMatch;
    }

    // Animasi mesin ketik (ketik ulang kalau pemain berubah)
    if (nameOnly !== lastMatchedPlayer) {
        lastMatchedPlayer = nameOnly; 
        
        const descText = descriptionDatabase[nameOnly];
        if (descText) {
            typeWriterEffect(`"${descText}"`, playerDescDisplay);
        } else {
            playerDescDisplay.textContent = "";
        }
    }
    
    updatePlayerVisuals(playerMatch);
    updateCardGrade(average);
    pointsDisplay.textContent = availablePoints;
}

// ==========================================
// Interaksi user
// ==========================================

// saat memilih archetype, reset stats dan available points
archetypeSelect.addEventListener('change', function() {
    currentArchetype = archetypes[this.value];
    availablePoints = 0; 
    rollsLeft = 3; 
    
    btnRollPoints.disabled = false;
    btnRollPoints.textContent = `🎲 Roll Potential (${rollsLeft})`;
    
    statList.forEach(stat => {
        document.getElementById(stat).value = currentArchetype.base[stat];
        document.getElementById(stat + '-display').textContent = currentArchetype.base[stat];
        document.getElementById(stat + '-display').classList.remove('max-cap-reached');
    });
    
    calculateStats();
});

// animasi gacha roll
btnRollPoints.addEventListener('click', function() {
    if (!currentArchetype || rollsLeft <= 0) return; 
    
    rollsLeft--; 
    
    btnRollPoints.disabled = true;
    document.querySelectorAll('.btn-plus, .btn-minus').forEach(btn => btn.disabled = true);

    let duration = 1000; 
    let intervalTime = 50; 
    let elapsedTime = 0;
    const minPoints = 20; 
    const maxPoints = 50; 
    const finalRolledPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;

    const rollAnimation = setInterval(() => {
        pointsDisplay.textContent = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
        elapsedTime += intervalTime;
        
        if (elapsedTime >= duration) {
            clearInterval(rollAnimation); 
            
            availablePoints = finalRolledPoints;
            pointsDisplay.textContent = availablePoints;
            
            statList.forEach(stat => {
                document.getElementById(stat).value = currentArchetype.base[stat];
                document.getElementById(stat + '-display').textContent = currentArchetype.base[stat];
                document.getElementById(stat + '-display').classList.remove('max-cap-reached');
            });

            if (rollsLeft > 0) {
                btnRollPoints.textContent = `🎲 Re-Roll (${rollsLeft})`;
                btnRollPoints.disabled = false;
            } else {
                btnRollPoints.textContent = `🚫 No Rolls Left`;
                btnRollPoints.disabled = true;
            }
            
            document.querySelectorAll('.btn-plus, .btn-minus').forEach(btn => btn.disabled = false);
            calculateStats();
        }
    }, intervalTime);
});

// Logika tombol tambah kurang stats
document.querySelectorAll('.btn-plus, .btn-minus').forEach(button => {
    button.addEventListener('click', function() {
        if (!currentArchetype) return;
        
        const targetId = this.getAttribute('data-target');
        const inputElement = document.getElementById(targetId);
        const displayElement = document.getElementById(targetId + '-display');
        let currentValue = parseInt(inputElement.value);
        
        if (this.classList.contains('btn-plus')) {
            if (currentValue < currentArchetype.max[targetId] && availablePoints > 0) {
                currentValue++; 
                availablePoints--;
                if (currentValue === currentArchetype.max[targetId]) {
                    displayElement.classList.add('max-cap-reached');
                }
            }
        } 
        else if (this.classList.contains('btn-minus')) {
            if (currentValue > currentArchetype.base[targetId]) {
                currentValue--; 
                availablePoints++;
                displayElement.classList.remove('max-cap-reached');
            }
        }
        
        inputElement.value = currentValue;
        displayElement.textContent = currentValue;
        calculateStats(); 
    });
});

// checkbox aksesoris
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        let equipped = [];
        if (document.getElementById('acc-sleeve').checked) equipped.push("Arm Sleeve");
        if (document.getElementById('acc-headband').checked) equipped.push("Headband");
        
        accDisplay.innerHTML = equipped.join('<br>');
    });
});