document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTLER ---
    const landingScreen = document.getElementById('landing-screen');
    const bookScreen = document.getElementById('book-screen');
    const puzzleScreen = document.getElementById('puzzle-screen');
    const winnerModal = document.getElementById('winner-modal');

    const btnOpenBook = document.getElementById('btn-open-book');
    const btnOpenPuzzle = document.getElementById('btn-open-puzzle');
    const btnBackMenu = document.getElementById('back-to-menu');
    const btnBackMenuPuzzle = document.getElementById('back-to-menu-puzzle');
    const btnReplay = document.getElementById('btn-replay'); // Yeni buton

    // --- PUZZLE AYARLARI ---
    const rows = 3;
    const cols = 3;
    // pieceSize değişkenine artık ihtiyacımız yok, yüzdelik sistem kullanacağız.
    const puzzleImageSrc = 'img/puzzle-full.jpg'; 

    // --- MENÜ GEÇİŞLERİ ---
    btnOpenBook.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        bookScreen.classList.remove('hidden');
    });

    btnOpenPuzzle.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        puzzleScreen.classList.remove('hidden');
        initPuzzle();
    });

    btnBackMenu.addEventListener('click', () => {
        bookScreen.classList.add('hidden');
        landingScreen.classList.remove('hidden');
    });

    btnBackMenuPuzzle.addEventListener('click', () => {
        puzzleScreen.classList.add('hidden');
        landingScreen.classList.remove('hidden');
        winnerModal.classList.add('hidden');
    });

    // Modal içindeki tekrar oyna butonu
    if(btnReplay) {
        btnReplay.addEventListener('click', () => {
            location.reload();
        });
    }

    // -----------------------------------------------------
    // --- KİTAP KODLARI (HİBRİT: 3D & MOBİL SLIDER) ---
    // -----------------------------------------------------
    const prevBtn = document.querySelector('#prev-btn');
    const nextBtn = document.querySelector('#next-btn');
    const book = document.querySelector('#book');
    const papers = document.querySelectorAll('.paper');
    
    // Mobil elemanlar
    const mobileImg = document.getElementById('mobile-current-img');
    const pageIndicator = document.getElementById('page-indicator');
    
    // Tüm resim kaynaklarını topla (Sırasıyla: p1-front, p1-back, p2-front...)
    let allImages = [];
    papers.forEach(p => {
        const fImg = p.querySelector('.front img');
        const bImg = p.querySelector('.back img');
        if(fImg) allImages.push(fImg.src);
        if(bImg) allImages.push(bImg.src);
    });

    // Durum değişkenleri
    let currentPaper = 1; // Masaüstü için (Kağıt sayısı: 1-12)
    let currentImageIndex = 0; // Mobil için (Resim sayısı: 0-23)
    let numOfPapers = papers.length;
    let maxPaper = numOfPapers + 1;

    // Başlangıç Ayarları
    function initBook() {
        // Masaüstü Z-Index
        papers.forEach((paper, index) => { 
            paper.style.zIndex = numOfPapers - index; 
        });
        
        // Mobil İlk Resim
        if(allImages.length > 0) {
            updateMobileView();
        }
    }

    function updateMobileView() {
        if(mobileImg && allImages.length > 0) {
            mobileImg.src = allImages[currentImageIndex];
            if(pageIndicator) {
                pageIndicator.textContent = `${currentImageIndex + 1} / ${allImages.length}`;
            }
        }
    }

    // Ekran genişliğini kontrol et
    function isMobile() {
        return window.innerWidth <= 768;
    }

    nextBtn.addEventListener('click', () => {
        if (isMobile()) {
            // --- MOBİL MANTIK (RESİM İLERLET) ---
            if (currentImageIndex < allImages.length - 1) {
                currentImageIndex++;
                updateMobileView();
            }
        } else {
            // --- MASAÜSTÜ MANTIK (KAĞIT ÇEVİR) ---
            if(currentPaper < maxPaper) {
                let activePaper = papers[currentPaper - 1];
                activePaper.classList.add('flipped');
                activePaper.style.zIndex = currentPaper; 
                currentPaper++;
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (isMobile()) {
            // --- MOBİL MANTIK (RESİM GERİ AL) ---
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateMobileView();
            }
        } else {
            // --- MASAÜSTÜ MANTIK (KAĞIT GERİ ÇEVİR) ---
            if(currentPaper > 1) {
                let previousPaper = papers[currentPaper - 2];
                previousPaper.classList.remove('flipped');
                previousPaper.style.zIndex = numOfPapers - (currentPaper - 2);
                currentPaper--;
            }
        }
    });

    // Başlat
    initBook();

    // -----------------------------------------------------
    // --- PUZZLE MANTIĞI (YENİLENMİŞ & RESPONSIVE) ---
    // -----------------------------------------------------
    let isPuzzleInitialized = false;

    function initPuzzle() {
        if(isPuzzleInitialized) return; // Sadece bir kere başlat

        const board = document.getElementById('puzzle-board');
        const repo = document.getElementById('piece-repository');
        board.innerHTML = '';
        repo.innerHTML = '';

        const pieces = [];

        // REPOSITORY DROP ALANI
        repo.addEventListener('dragover', (e) => e.preventDefault());
        repo.addEventListener('drop', handleDrop);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let id = r * cols + c + 1;

                // Slot Oluştur
                let slot = document.createElement('div');
                slot.classList.add('puzzle-slot');
                slot.dataset.expectedId = id;
                // Mobil dokunmatik desteği için touch eventleri de eklenebilir ama şu an HTML5 DragDrop kullanıyoruz.
                slot.addEventListener('dragover', (e) => e.preventDefault());
                slot.addEventListener('drop', handleDrop);
                board.appendChild(slot);

                // Parça Oluştur
                let piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                piece.draggable = true;
                piece.dataset.id = id;

                // Resmi Yüzdelik Olarak Ayarla (Responsive Çözüm)
                piece.style.backgroundImage = `url(${puzzleImageSrc})`;
                piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
                
                // Yüzde hesaplama: (Index / (Toplam - 1)) * 100
                // 3x3 için: 0%, 50%, 100%
                let xPercent = (c / (cols - 1)) * 100;
                let yPercent = (r / (rows - 1)) * 100;
                
                piece.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

                // Sürükleme Eventleri
                piece.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', id); // 'text' yerine 'text/plain' daha standart
                    // Sürüklenen elementin referansını saklayabiliriz gerekirse
                    e.dataTransfer.effectAllowed = "move";
                    setTimeout(() => piece.classList.add('dragging'), 0);
                });

                piece.addEventListener('dragend', () => {
                    piece.classList.remove('dragging');
                });

                pieces.push(piece);
            }
        }

        // Karıştır ve Dağıt
        pieces.sort(() => Math.random() - 0.5);
        pieces.forEach(p => repo.appendChild(p));
        isPuzzleInitialized = true;
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        // Dragging class'ına sahip olanı bulmak daha güvenli olabilir
        const draggedElement = document.querySelector(`.puzzle-piece[data-id='${draggedId}']`);
        
        if(!draggedElement) return;

        let target = e.target;

        // 1. REPOSITORY'E GERİ BIRAKMA
        if (target.id === 'piece-repository' || target.closest('#piece-repository')) {
            const repo = document.getElementById('piece-repository');
            repo.appendChild(draggedElement);
            resetPieceStyle(draggedElement);
            return;
        }

        // 2. SLOT'A BIRAKMA
        // Hedef slot mu yoksa slotun içindeki başka bir parça mı?
        let slot = target.classList.contains('puzzle-slot') ? target : target.closest('.puzzle-slot');

        if (slot) {
            // Eğer slot doluysa işlem yapma (veya yer değiştirme mantığı eklenebilir, şimdilik basit tutuyoruz)
            if (slot.children.length === 0) {
                slot.appendChild(draggedElement);
                lockPieceInSlot(draggedElement);
                checkWin();
            }
        }
    }

    function resetPieceStyle(el) {
        el.style.position = 'relative';
        el.style.top = 'auto';
        el.style.left = 'auto';
        el.style.width = ''; // CSS'ten gelen defaulta dön
        el.style.height = '';
    }

    function lockPieceInSlot(el) {
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%'; // Slotun boyutunu al
        el.style.height = '100%';
    }

    function checkWin() {
        const slots = document.querySelectorAll('.puzzle-slot');
        let correctCount = 0;
        slots.forEach(slot => {
            if(slot.children.length > 0) {
                const piece = slot.children[0];
                if(slot.dataset.expectedId === piece.dataset.id) {
                    correctCount++;
                }
            }
        });

        if(correctCount === 9) { // 3x3 = 9
            setTimeout(() => {
                winnerModal.classList.remove('hidden');
                startConfetti();
            }, 300);
        }
    }

    function startConfetti() {
        const container = document.getElementById('confetti-container');
        if(!container) return;
        
        const colors = ['#f39c12', '#e74c3c', '#8e44ad', '#3498db', '#2ecc71'];
        for(let i=0; i<100; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(conf);
            setTimeout(() => conf.remove(), 5000);
        }
    }
});
