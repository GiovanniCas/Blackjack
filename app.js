const app = new Vue({
    el: '#app',
    data: {
        isGameRunning: false,
        isGameEnded: false,
        msgBoard: 'Punta per giocare!',
        playerPoints: 0,
        dealerPoints: 0,
        turno: 0,
        dealerHand: [],
        playerHand: [],
        deck: [],
        cardswitch: [],
        simbolo$: '$',
        saldo: 1000, 
        puntata: 0,
        chips: [{ valore : 10 , immagine:'chip_blu.png'}, { valore : 25 , immagine:'chip_rossa.png'}, { valore : 50 , immagine : 'chip_verde.png'}, { valore : 100, immagine :'chip_nera.png'}],
       
    },
    beforeMount() {
        this.deck = this.generateCardPool();   
        this.cardSwitch = new Array(52).fill(false);
        
       
    },
    methods: {
        punta(e){
            if(!this.isGameEnded && (this.saldo - e >= 0)) {
                this.saldo -= e;
                this.puntata += e;
            }
        },
        
        newGame() {
            window.location.href = "./blackjack.html";
            this.startNewGame();
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
                
            }
        },
        hit() {
            this.playerHand.push(this.dealCard());
            this.playerPoints = this.checkHandValue(this.playerHand);

            if(this.playerPoints > 21) {
                this.playerPoints = "SBALLATO!";
                this.isGameEnded = true;
                this.msgBoard = 'SBALLATO! HAI PERSO!';
            }
            if(this.playerPoints === 21) {
                this.msgBoard = 'BLACKJACK!';
                this.stand();
            }
        },
        stand() {
            if(this.playerPoints > this.dealerPoints) {
                while(this.dealerPoints <= 16 ) {
                    // setTimeout(() => this.dealCard(), 300);
                    this.dealerHand.push(this.dealCard());
                    this.dealerPoints = this.checkHandValue(this.dealerHand);
                
                    if(this.dealerPoints > 21) {
                        this.dealerPoints = "SBALLATO!";
                        this.isGameEnded = true;
                        this.msgBoard = "IL DEALER HA SBALLATO! HAI VINTO!"
                        this.saldo += this.puntata * 2;
                        return;
                    }
                }
            }

            if(this.dealerPoints > this.playerPoints) {
                this.msgBoard = "HAI PERSO!";
            }else if(this.dealerPoints === this.playerPoints) {
                this.msgBoard = 'PAREGGIO!';
                this.saldo += this.puntata;
            }else {
                this.msgBoard = 'HAI VINTO!';
                this.saldo += this.puntata * 2;

            }
            this.isGameEnded = true;
            if (this.saldo == 0) {
                alert('ohoh')
            }
        },
        giveUp() {
            window.location.href = "./home.html";
        },
        clearBoardNStartNewGame() {
            
            this.isGameRunning = false;
            this.isGameEnded = false;
            this.msgBoard = 'Punta per giocare!';
            this.playerPoints = 0;
            this.dealerPoints = 0;
            this.playerHand = [];
            this.dealerHand = [];
            this.puntata = 0;
            if(this.vincita > 0) {
                this.saldo += this.vincita;
            }
            
            this.turno++;
            //ricarcio pagina per evitare blocco
            if(this.turno === 8) {
                console.log('ciao');
                window.location.reload();
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
        getChip(chip) {
            return `./PNG-cards-1.3/${chip}`;
        },
      
        reloadPage() {
            this.window.location.reload();
        },
     

    },
    created: function () {
        
        this.$nextTick(function () {
            
            // Code that will run only after the
            // entire view has been rendered
            this.startNewGame();
            
        })
    }

})