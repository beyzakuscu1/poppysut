document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTLERİ SEÇ ---
    const prevBtn = document.querySelector('#prev-btn');
    const nextBtn = document.querySelector('#next-btn');
    const book = document.querySelector('#book');
    
    // Kitap ve Puzzle geçiş butonları
    const btnOpenBook = document.getElementById('btn-open-book');
    const btnOpenPuzzle = document.getElementById('btn-open-puzzle');
    const btnBackMenu = document.getElementById('back-to-menu');
    const btnBackMenuPuzzle = document.getElementById('back-to-menu-puzzle');

    const landingScreen = document.getElementById('landing-screen');
    const bookScreen = document.getElementById('book-screen');
    const puzzleScreen = document.getElementById('puzzle-screen');

    // Sayfaları seç
    const papers = document.querySelectorAll('.paper');
    const numOfPapers = papers.length;
    let currentLocation = 1;
    let maxLocation = numOfPapers + 1;

    // --- BAŞLANGIÇ AYARLARI ---
    // Sayfaların üst üste doğru dizilmesi için
    function initZIndex() {
        papers.forEach((paper, index) => {
            paper.style.zIndex = numOfPapers - index;
        });
    }
    initZIndex();

    // --- BUTON İŞLEVLERİ (SAYFA ÇEVİRME) ---
    
    nextBtn.addEventListener('click', () => {
        if(currentLocation < maxLocation) {
            let currentPaper = papers[currentLocation - 1];
            
            // Sayfayı çevir
            currentPaper.classList.add('flipped');
            
            // Z-Index Ayarı: Çevrilen sayfa solda en üstte olmalı
            // Formül: Kendi sırası (index + 1)
            currentPaper.style.zIndex = currentLocation; 

            // Kitabı ortala
            if(currentLocation === 1) {
                book.style.transform = "translateX(50%)";
            }
            
            currentLocation++;
        }
    });

    prevBtn.addEventListener('click', () => {
        if(currentLocation > 1) {
            let previousPaper = papers[currentLocation - 2];
            
            // Sayfayı geri çevir
            previousPaper.classList.remove('flipped');
            
            // Z-Index Ayarı: Geri dönünce sağda en üstte olmalı
            // Formül: Toplam kağıt - index
            let originalZIndex = numOfPapers - (currentLocation - 2);
            previousPaper.style.zIndex = originalZIndex;

            // Kitabı ortala
            if(currentLocation === 2) {
                book.style.transform = "translateX(0%)";
            }

            currentLocation--;
        }
    });

    // --- MENÜ GEÇİŞLERİ ---
    
    btnOpenBook.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        bookScreen.classList.remove('hidden');
    });

    btnOpenPuzzle.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        puzzleScreen.classList.remove('hidden');
    });

    btnBackMenu.addEventListener('click', () => {
        bookScreen.classList.add('hidden');
        landingScreen.classList.remove('hidden');
    });

    btnBackMenuPuzzle.addEventListener('click', () => {
        puzzleScreen.classList.add('hidden');
        landingScreen.classList.remove('hidden');
    });
});