const app = new Vue({
    el: '#app',
    data: {
        isGameRunning: false,
        isGameEnded: false,
        msgBoard: 'Make Your Move...',
        playerPoints: 0,
        dealerPoints: 0,
        turno: 0,
        dealerHand: [],
        playerHand: [],
        deck: [],
        cardswitch: [],
    },
    beforeMount() {
        this.deck = this.generateCardPool();   
        this.cardSwitch = new Array(52).fill(false);
        
    },
    methods: {
        newGame() {

            window.location.href = "http://127.0.0.1:5500/blackjack.html";
        },
        startNewGame() {
            this.isGameRunning = true;
            for (let i = 0; i < 2; i++) {
                this.playerHand.push(this.dealCard());
                this.dealerHand.push(this.dealCard());
            }    
            this.dealerPoints = this.checkHandValue(this.dealerHand);
            this.playerPoints = this.checkHandValue(this.playerHand);
            if(this.playerPoints === 21) {
                this.msgBoard = 'BLACKJACK!';
                this.stand();
            }
        },
        hit() {
            this.playerHand.push(this.dealCard());
            this.playerPoints = this.checkHandValue(this.playerHand);

            if(this.playerPoints > 21) {
                this.playerPoints = "Busted!";
                this.isGameEnded = true;
                this.msgBoard = 'Busted! You Lost...';
            }
            if(this.playerPoints === 21) {
                this.msgBoard = 'BLACKJACK!';
                this.stand();
            }
        },
        stand() {
            if(this.playerPoints > this.dealerPoints) {
                while(this.dealerPoints <= 16 ) {
                    this.dealerHand.push(this.dealCard());
                    this.dealerPoints = this.checkHandValue(this.dealerHand);
                
                    if(this.dealerPoints > 21) {
                        this.dealerPoints = "Busted!";
                        this.isGameEnded = true;
                        this.msgBoard = "Dealer Busted! You win!"
                        return;
                    }
                }
            }

            if(this.dealerPoints > this.playerPoints) {
                this.msgBoard = "You Lost..."
            }else if(this.dealerPoints === this.playerPoints) {
                this.msgBoard = 'DRAW';
            }else {
                this.msgBoard = 'You Win!';
            }
            this.isGameEnded = true;
        },
        giveUp() {
            this.isGameRunning = false;
            this.isGameEnded = false;
            this.msgBoard = 'Make Your Move...';
            this.playerPoints = 0;
            this.dealerPoints = 0;
            this.playerHand = [];
            this.dealerHand = [];
        },
        clearBoardNStartNewGame() {
            this.turno++;
            
            //ricarcio pagina per evitare blocco
            if(this.turno === 8) {
                console.log('ciao');
                window.location.reload();
                
            }else{
                this.giveUp();
            }
            
            this.startNewGame();

        },
        generateCardPool() {
            const colors = ['_of_spades', '_of_hearts', '_of_clubs', '_of_diamonds'];
            const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'ace', 'jack', 'queen', 'king'];
            const pool = [];
            values.map(v => {
                colors.map(c => {
                    pool.push(`${v}${c}`);
                })
            })
            return pool;
            
        },
        checkHandValue(hand) {
            let value = 0;
            hand.map(e => {
                let array_values = e.split("_");
                let v = array_values[0]
                
                if(Number.isNaN(parseInt(v)) && hand.length === 2 && v === 'ace' && value < 11) {
                    v = 11;
                } else if ((Number.isNaN(parseInt(v)) && hand.length >= 3 && v ==='ace')
                || (Number.isNaN(parseInt(v)) && hand.length === 2 && v ==='ace' && value >= 11)) {
                    v = 1;
                } else if (Number.isNaN(parseInt(v))) {
                    v = 10;
                } else {
                    v = parseInt(v)
                }
                value += v;
            });
            return value;

        },
        dealCard() {
            let index;
            do {
                index = Math.floor(Math.random() * 52);
            } while (this.cardSwitch[index]);
            
            const card = this.deck[index];
            
            this.cardSwitch[index] = true;
            return card;

        },
        getSource(card) {
            return `./PNG-cards-1.3/${card}.png`;
        },
        reloadPage() {
            this.window.location.reload();
        }

    },
    // created: function () {
        
    //     this.$nextTick(function () {
    //         // if(this.turno === 8) {
    //             // Code that will run only after the
    //             // entire view has been rendered
    //             this.startNewGame();
    //         // }
    //     })
    // }

})