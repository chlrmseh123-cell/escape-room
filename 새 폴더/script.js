document.addEventListener('DOMContentLoaded', () => {
    // 게임 상태
    const gameState = {
        hints: ['?', '?', '?', '?'],
        solved: {
            tent: false,
            child: false,
            rock: false,
            water: false,
        }
    };

    // DOM 요소 가져오기
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');
    const clickableAreas = document.querySelectorAll('.clickable-area');
    const hintSpans = [
        document.getElementById('hint-1'),
        document.getElementById('hint-2'),
        document.getElementById('hint-3'),
        document.getElementById('hint-4'),
    ];

    // 모달 열기 함수
    function openModal() {
        modal.style.display = 'flex';
    }

    // 모달 닫기 함수
    function closeModal() {
        modal.style.display = 'none';
        modalBody.innerHTML = ''; // 모달 내용 초기화
    }

    // 힌트 UI 업데이트 함수
    function updateHintsUI() {
        hintSpans.forEach((span, index) => {
            span.textContent = gameState.hints[index];
        });
    }

    // 클릭 이벤트 리스너 설정
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    clickableAreas.forEach(area => {
        area.addEventListener('click', () => {
            const id = area.id;
            // 이미 해결한 퍼즐이면 메시지 표시
            if (gameState.solved[id.replace('-','_')]) {
                modalBody.innerHTML = '<h2>이미 해결한 문제입니다.</h2>';
                openModal();
                return;
            }
            
            // 각 오브젝트에 맞는 게임 로드
            switch (id) {
                case 'orange-tent':
                    loadTentGame();
                    break;
                case 'dressed-child':
                    loadChildGame();
                    break;
                case 'rock':
                    loadRockGame();
                    break;
                case 'valley-water':
                    loadWaterGame();
                    break;
            }
            openModal();
        });
    });

    // 1. 주황색 텐트 게임
    function loadTentGame() {
        modalBody.innerHTML = `
            <h2>잠긴 지퍼의 비밀</h2>
            <p>"가장 긴 선을 따라가라"는 문구는 사실 우리를 헷갈리게 하기 위한 속임수였다.<br>이 텐트의 색깔처럼 강렬하고, 모든 것의 시작을 알리는 숫자는 무엇일까?</p>
            <p><strong>문제: 백조의 목처럼 부드럽게 구부러진 모양의 숫자를 입력하세요.</strong></p>
            <input type="text" id="tent-answer" placeholder="숫자 한 개 입력">
            <button id="tent-submit">확인</button>
        `;
        document.getElementById('tent-submit').addEventListener('click', () => {
            const answer = document.getElementById('tent-answer').value;
            if (answer === '2') {
                modalBody.innerHTML = '<h2>정답!</h2><p>나침반이 백조의 목처럼 생긴 숫자 \'2\'를 가리켰습니다.</p><p><strong>첫 번째 비밀번호 [ 2 ]를 획득했습니다.</strong></p>';
                gameState.hints[0] = '2';
                gameState.solved.tent = true;
                updateHintsUI();
            } else {
                modalBody.innerHTML += '<p style="color:red;">틀렸습니다. 다시 생각해보세요.</p>';
            }
        });
    }

    // 2. 옷 입은 아이 게임 (메모리 게임)
    function loadChildGame() {
        modalBody.innerHTML = `
            <h2>돌멩이 그림 맞추기</h2>
            <p>아이의 돌멩이들 중 짝이 맞는 그림을 찾아주세요.</p>
            <div id="stone-game-container"></div>
        `;
        const container = document.getElementById('stone-game-container');
        const items = ['🐟', '🐟', '⭐', '⭐', '🌳', '🌳', '🌙', '🌙'];
        let flippedCards = [];
        let matchedPairs = 0;
        
        items.sort(() => 0.5 - Math.random()); // 섞기

        items.forEach(item => {
            const stone = document.createElement('div');
            stone.classList.add('stone');
            stone.dataset.value = item;
            stone.textContent = '';
            stone.addEventListener('click', () => {
                if (flippedCards.length < 2 && !stone.classList.contains('flipped')) {
                    stone.textContent = stone.dataset.value;
                    stone.classList.add('flipped');
                    flippedCards.push(stone);

                    if (flippedCards.length === 2) {
                        setTimeout(checkMatch, 700);
                    }
                }
            });
            container.appendChild(stone);
        });

        function checkMatch() {
            const [card1, card2] = flippedCards;
            if (card1.dataset.value === card2.dataset.value) {
                matchedPairs++;
                if (matchedPairs === items.length / 2) {
                    modalBody.innerHTML = '<h2>성공!</h2><p>아이가 숨기고 있던 마지막 돌멩이는 아무것도 없는 동그란 모양입니다.</p><p><strong>두 번째 비밀번호 [ 0 ]을 획득했습니다.</strong></p>';
                    gameState.hints[1] = '0';
                    gameState.solved.child = true;
                    updateHintsUI();
                }
            } else {
                card1.textContent = '';
                card2.textContent = '';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            flippedCards = [];
        }
    }

    // 3. 바위 게임
    function loadRockGame() {
        modalBody.innerHTML = `
            <h2>다이빙대의 숨겨진 숫자</h2>
            <p>이 사진 파일의 이름은 'Generated Image August 11, 2025 - 3:07PM.jpeg' 입니다.</p>
            <p>"사진이 만들어진 시간(Hour)과 분(Minute)의 첫 숫자를 더하라"는 메모가 있지만, 그 아래에 작은 글씨가 있습니다.</p>
            <p><strong>"첫 번째 단서를 다시 보라"</strong></p>
            <input type="text" id="rock-answer" placeholder="세 번째 단서 입력">
            <button id="rock-submit">확인</button>
        `;
        document.getElementById('rock-submit').addEventListener('click', () => {
            const answer = document.getElementById('rock-answer').value;
            if (answer === '2') {
                modalBody.innerHTML = '<h2>정답!</h2><p>첫 번째 단서였던 \'2\'가 세 번째 단서이기도 했습니다.</p><p><strong>세 번째 비밀번호 [ 2 ]를 획득했습니다.</strong></p>';
                gameState.hints[2] = '2';
                gameState.solved.rock = true;
                updateHintsUI();
            } else {
                modalBody.innerHTML += '<p style="color:red;">틀렸습니다. 첫 번째 단서가 무엇이었는지 기억해보세요.</p>';
            }
        });
    }

    // 4. 계곡물 게임 (최종 탈출)
    function loadWaterGame() {
        const allSolved = gameState.solved.tent && gameState.solved.child && gameState.solved.rock;

        if (!allSolved) {
            modalBody.innerHTML = `
                <h2>하늘에 비친 마지막 단서</h2>
                <p>계곡물에 비친 구름이 천천히 움직이더니 하나의 모양을 만듭니다.</p>
                <p style="font-size: 80px; margin: 20px 0;">5</p>
                <p><strong>네 번째 비밀번호 [ 5 ]를 획득했습니다.</strong></p>
                <button id="water-confirm">확인</button>
            `;
            gameState.hints[3] = '5';
            gameState.solved.water = true; // 단서는 찾았으므로 solved 처리
            updateHintsUI();
            document.getElementById('water-confirm').addEventListener('click', closeModal);
        } else {
             modalBody.innerHTML = `
                <h2>탈출</h2>
                <p>모든 비밀번호 조각을 모았습니다. 계곡물에 비밀번호를 입력하여 탈출하세요!</p>
                <input type="text" id="final-password" placeholder="비밀번호 4자리" maxlength="4">
                <button id="escape-button">탈출</button>
            `;
            document.getElementById('escape-button').addEventListener('click', () => {
                const finalAnswer = document.getElementById('final-password').value;
                if (finalAnswer === '2025') {
                    document.body.innerHTML = `<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; background-color:black; color:white;"><h1>탈출 성공!</h1><p>고요한 계곡의 비밀을 풀고 무사히 돌아왔습니다.</p></div>`;
                } else {
                    modalBody.innerHTML += '<p style="color:red;">비밀번호가 틀렸습니다. 힌트를 다시 확인하세요.</p>';
                }
            });
        }
    }

    // 초기 힌트 UI 설정
    updateHintsUI();
});