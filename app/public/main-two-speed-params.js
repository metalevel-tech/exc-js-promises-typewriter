const nodes = {
    imageShotWrapper: document.querySelector('.output-image-shot-wrapper'),

    outputContainer: document.querySelector('#output.joke-container'),
    outputJokeCanvas: document.querySelector('#output .joke-canvas'),
    outputJoke: document.querySelector('#output pre.joke'),

    outputJokeId: document.querySelector('#info .joke-id'),
    outputJokeIndex: document.querySelector('#info .joke-index'),
    outputJokeImage: document.querySelector('#info .joke-image-shot'),
    outputJokeImageLink: document.querySelector('#info .joke-image-shot-link'),

    btnLeft: document.querySelector('.nav-btn-left'),
    btnRight: document.querySelector('.nav-btn-right'),
    btnShow: document.querySelector('.nav-center'),

    autoplaySwitch: document.querySelector('.auto-play'),
    soundSwitch: document.querySelector('.sound-switch'),
    imageSwitch: document.querySelector('.img-switch')
};

const effectFadeOut = {
    an0: [{ transform: 'translateY(0)' }, { transform: 'translateY(-30px)' }],
    ta0: { duration: 50, iterations: 1 },
    ps0: [{ transform: 'translateY(-30px)' }, { transform: 'translateY(-30px)' }],
    tp0: { duration: 0, iterations: 1 },

    an1: [{ transform: 'translateY(-30px)' }, { transform: 'translateY(-140px)' }],
    ta1: { duration: 350, iterations: 1 },
    ps1: [{ transform: 'translateY(-140px)' }, { transform: 'translateY(-140px)' }],
    tp1: { duration: 200, iterations: 1 },

    an2: [{ transform: 'translateY(-140px)' }, { transform: 'translateY(-240px)' }],
    ta2: { duration: 300, iterations: 1 },
    ps2: [{ transform: 'translateY(-240px)' }, { transform: 'translateY(-240px)' }],
    tp2: { duration: 200, iterations: 1 },

    an3: [{ transform: 'translateY(-240px)' }, { transform: 'translateY(-348px)' }],
    ta3: { duration: 250, iterations: 1 },
    ps3: [{ transform: 'translateY(-348px)' }, { transform: 'translateY(-348px)' }],
    tp3: { duration: 250, iterations: 1 }
};

const newJokeButton = {
    msgs: [
        'New joke',
        'Once gain',
        'Tell me a joke',
        'Next joke',
        'Fetch a new joke',
        'Show me a new joke',
        'Show next joke',
        'Joke again',
        'Laugh me again',
        'Tell me another joke',
        'Tell me a new joke',
        'Show me another joke',
        'Something funny',
        'Something funny again'
    ],
    resolve: true
}

const typewriter = {
    switch: {
        src: './assets/switch-sound-effect.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.2,
        playbackRate: 1,
        loop: false
    },
    takeShot: {
        src: './assets/take-a-shot.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.8,
        playbackRate: 1,
        loop: false
    },
    type: {
        src: './assets/typewriter-type.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.8,
        playbackRate: 1.15,
        loop: true
    },
    keyStroke: {
        src: './assets/typewriter-key.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.15,
        playbackRate: 1.4,
        loop: false
    },
    newLine: {
        src: './assets/typewriter-linefeed-bell.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.5,
        playbackRate: 1,
        loop: false
    },
    lineReturn: {
        src: './assets/typewriter-linefeed-return.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.5,
        playbackRate: 1,
        loop: false
    },
    paperRollOut: {
        src: './assets/typewriter-paper-roll-out.mp3',
        audio: 'Audio() generated bu the fetch() method',
        volume: 0.5,
        playbackRate: 1,
        loop: false
    },
    async fetch(sound) {
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof (this[sound].audio) !== 'object') {
                    const audioResponse = await fetch(this[sound].src);

                    if (!audioResponse.ok)
                        throw new Error(`${this.this[sound].src} not found, response: ${audioResponse.status}`);

                    const audioFile = await audioResponse.blob();

                    this[sound].audio = new Audio(URL.createObjectURL(audioFile));
                    this[sound].audio.volume = this[sound].volume;
                    this[sound].audio.playbackRate = this[sound].playbackRate;
                    this[sound].audio.loop = this[sound].loop;
                }

                this.soundOnOff();

                resolve(`Resolve: ${sound}`);
            } catch (error) {
                reject(`We have a problem at fetch(sound): '${sound}', ${error.message}`);
            }
        });
    },
    soundOnOff() {
        for (const sound in this) {
            if (this[sound].audio instanceof Audio) {
                if (localStorage.getItem('soundOnOff') === 'on') {
                    this[sound].audio.muted = false;
                } else if (localStorage.getItem('soundOnOff') === 'off') {
                    this[sound].audio.muted = true;
                }
            }
        }
    }
}

class Joke {
    /**
     * The Instances model
     */

    // Properties that will be provided by an API fetch
    id;
    joke;
    categories;
    // Properties provided by the constructor
    index;
    lineCount;
    fontSize;
    // Properties provided by the other methods
    image;

    constructor() {
        this.index = this.constructor.countInstances();
        this.lineCount = 1;
        this.fontSize = 25.6;
    }

    /**
     * The Instances Prototype model
     */

    async jokeType() {
        // Select the elements to be manipulated
        const {
            outputJoke, outputJokeId,
            outputJokeIndex, outputJokeCanvas
        } = nodes;

        // Clear the output container
        await this.canvasPrepare();

        // Set the typewriter parameters
        const speed = 60;
        const interval = 100;
        let even = false;
        let calculatedSpeed = speed / 1.5;

        // Function to display one character at a time
        const typeSingleCharacter = async (char, index, array) => {
            // This is the main function
            await new Promise(resolve => {
                const currentText = outputJoke.innerHTML;
                if (char.match(/\s|[;'.,]/)) {
                    outputJoke.innerHTML += '|';
                    calculatedSpeed = speed / 1.5;
                } else {
                    outputJoke.innerHTML += '_';
                    calculatedSpeed = speed;
                }

                this.fitJokeToContainer();
                this.newLineDetect();

                setTimeout(() => {
                    outputJoke.innerHTML = currentText + char;

                    this.fitJokeToContainer();
                    this.newLineDetect();

                    // If it is the last charter do additional tasks
                    if (Number(index) === array.length - 1) {
                        typewriter.type.audio.pause();
                        typewriter.type.audio.currentTime = 0;
                        typewriter.lineReturn.audio.play();
                        typewriter.keyStroke.audio.play();

                        // Unlock the new joke button 1 second later
                        setTimeout(() => {
                            // typewriter.lineReturn.audio.pause();
                            typewriter.type.audio.pause();
                            typewriter.keyStroke.audio.pause();

                            newJokeButton.resolve = true;
                            const btnMessage = newJokeButton.msgs[
                                Math.random() * newJokeButton.msgs.length | 0
                            ];
                            nodes.btnShow.textContent = btnMessage;


                            setTimeout(() => {
                                if (localStorage.getItem('imageOnOff') === 'on') this.generateImage();
                            }, 100);
                        }, 1000);

                        // Call new joke in autoplay mode
                        setTimeout(() => {
                            if (localStorage.getItem('autoPlayOnOff') === 'on') Joke.newJoke();
                        }, 5000);
                    } else {
                        // Bind the sound effects more close to the displayed text
                        if (char.match(/[.?!:,-/#"']/)) {
                            typewriter.type.audio.currentTime = 0.08;
                            typewriter.keyStroke.audio.play();
                        } else if (char.match(/[skfNVI0-9]/)) {
                            typewriter.type.audio.currentTime = 0.1;
                            typewriter.keyStroke.audio.play();
                        } else if (char.match(/\s/)) {
                            if (even) {
                                typewriter.type.audio.currentTime = 0.1;
                                typewriter.keyStroke.audio.play();
                                even = false;
                            } else if (!even) {
                                typewriter.type.audio.currentTime = 0.4;
                                typewriter.keyStroke.audio.currentTime = 0.08;
                                typewriter.keyStroke.audio.play();
                                even = true;
                            }
                        }
                    }

                    resolve(`Resolve: ${char}`);
                }, calculatedSpeed);
            });

            await new Promise(resolve => {
                this.fitJokeToContainer();
                this.newLineDetect();

                setTimeout(() => {
                    resolve(`Resolve: ${char}, with index: ${index}; array length: ${array.length}`);
                }, interval);
            });
        }

        // Fix some problems in the text of the joke
        const text = this.joke.replace(/&quot;/g, '"');

        // Process the text of the joke as an array of characters...
        for (const index in text) {
            await typeSingleCharacter(text[index], index, text);
            // .then(response => {console.log(response)});
        }
    }

    async canvasPrepare() {
        const {
            outputJoke, outputJokeId,
            outputJokeIndex, outputJokeCanvas
        } = nodes;

        // Block the user's input
        newJokeButton.resolve = false;

        // Fetch the sound effects if they doesn't exist
        await typewriter.fetch('type');
        await typewriter.fetch('keyStroke');
        await typewriter.fetch('newLine');
        await typewriter.fetch('lineReturn');
        await typewriter.fetch('paperRollOut'); //.then(() => { });

        typewriter.paperRollOut.audio.currentTime = 0.2;
        typewriter.paperRollOut.audio.play();

        // Take out the last joke from the container
        await outputJokeCanvas.animate(effectFadeOut.an0, effectFadeOut.ta0).finished
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.ps0, effectFadeOut.tp0).finished; })
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.an1, effectFadeOut.ta1).finished; })
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.ps1, effectFadeOut.tp1).finished; })
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.an2, effectFadeOut.ta2).finished; })
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.ps2, effectFadeOut.tp2).finished; })
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.an3, effectFadeOut.ta3).finished; })
            .then(() => { return outputJokeCanvas.animate(effectFadeOut.ps3, effectFadeOut.tp3).finished; })
            .then(() => {
                outputJoke.innerHTML = ''; // Clear the output container
                return new Promise(resolve => { setTimeout(() => { resolve('Animation finished'); }, 300); });
            })
            .catch(error => { throw new Error(`Animate error: ${error}`); });


        // Apply the sound preferences
        typewriter.soundOnOff();
        // Play the main typewriter sound effect
        typewriter.type.audio.play();
        // Display the new joke's visible data
        this.displayVisibleData();
        // Resolve the next step
        return new Promise(resolve => { resolve('Canvas prepared'); });
    }

    displayVisibleData() {
        const {
            outputJoke, outputJokeId,
            outputJokeIndex, outputJokeCanvas
        } = nodes;

        outputJoke.dataset.index = this.index;
        outputJokeId.textContent = this.id;
        outputJokeIndex.textContent = this.index + 1;
        outputJoke.style.fontSize = `${this.fontSize}px`;
    }

    newLineDetect() {
        const luneNumber = this.getNumberOfLines();
        if (this.lineCount < luneNumber) {
            this.lineCount = luneNumber;

            typewriter.type.audio.currentTime = 0.25;
            typewriter.newLine.audio.play();
        }
    }

    getNumberOfLines() {
        const { outputJoke } = nodes;

        const jokeHeight = parseFloat(
            window.getComputedStyle(outputJoke, null).getPropertyValue('height')
        );

        const lineHeight = parseFloat(
            window.getComputedStyle(outputJoke, null).getPropertyValue('line-height')
        );

        return Math.floor(jokeHeight / lineHeight);
    }

    fitJokeToContainer() {
        const { outputJoke, outputContainer } = nodes;

        let jokeHeight = parseFloat(
            window.getComputedStyle(outputJoke, null).getPropertyValue('height')
        );

        const containerHeight = parseFloat(
            window.getComputedStyle(outputContainer, null).getPropertyValue('height')
        );

        let jokeFontSize = parseFloat(
            window.getComputedStyle(outputJoke, null).getPropertyValue('font-size')
        );

        if (jokeHeight >= containerHeight) {
            jokeFontSize -= 0.1;
            outputJoke.style.fontSize = `${jokeFontSize}px`;

            this.newLineDetect();
            this.fitJokeToContainer();
        }
        this.fontSize = jokeFontSize;
        this.newLineDetect();
    }

    async generateImage(sound = true) {
        if (newJokeButton.resolve) {
            const { imageShotWrapper, outputJokeImage, outputJokeImageLink } = nodes;

            // Generate the image if it doesn't exist
            if (!this.image) {
                // Deploy the 'dom-to-image' script if it doesn't exist
                if (!document.querySelector('head #dom-to-image')) {
                    await fetch('./assets/dom-to-image.min.js')
                        .then(response => {
                            if (response.ok) return response.blob();
                            else throw new Error(`'dom-to-image' fetch error: ${response.status}`);
                        })
                        .then(src => {
                            const script = document.createElement('script');
                            script.src = URL.createObjectURL(src);
                            script.type = 'text/javascript';
                            script.id = 'dom-to-image';
                            document.head.appendChild(script);

                            return new Promise(resolve => {
                                script.onload = () => { resolve('Script loaded'); };
                            });
                        })
                        .catch(error => { throw new Error(`Fetch error: ${error}`); });
                }

                // const image = await domtoimage.toBlob(imageShotWrapper);
                // this.image = URL.createObjectURL(image);
                this.image = await domtoimage.toPng(imageShotWrapper);
            }

            outputJokeImage.src = this.image;
            outputJokeImageLink.href = this.image;
            outputJokeImageLink.download = `joke-${this.id}.png`;

            if (sound) typewriter.takeShot.audio.play();
        }
    }
    /**
     * The Class constructor model
     */

    static countInstances = (function () {
        let count = 0;
        return () => count++;
    })();

    static jokeList = [];

    static async fetchJoke() {
        return fetch('https://api.icndb.com/jokes/random')
            .then(response => {
                if (!response.ok)
                    throw new Error(
                        `Network error: ${response.status} ${response.statusText}`
                    );
                return response.json();
            })
            .then(data => {
                if (this.jokeList.find(joke => joke.id === data.value.id)) {
                    this.fetchJoke(); // We have already fetched this joke, so we fetch another one
                } else {
                    const joke = Object.assign(new Joke(), data.value);
                    const jokeListLength = this.jokeList.push(joke);

                    return new Promise((resolve, reject) => {
                        // return the index of the last element
                        resolve(jokeListLength - 1);
                    });
                }

            })
            .catch(error => {
                console.error(`We have a problem at fetchJoke(): ${error}`);
            });
    }

    static async newJoke() {
        if (newJokeButton.resolve) {
            try {
                const lastElementIndex = await this.fetchJoke();
                this.jokeList[lastElementIndex].jokeType();
            } catch (error) {
                // console.error(`We have a problem at newJoke(): ${error}`);
                setTimeout(() => {
                    this.newJoke();
                }, 100);
            }
        }
    }

    static changeJoke(direction) {
        const jokes = this.jokeList;

        if (newJokeButton.resolve && jokes.length > 1) {
            const {
                outputJoke, outputJokeId,
                outputJokeIndex, outputJokeCanvas
            } = nodes;

            // changeSong() should be prototype method go have access to this.index,
            // but this will bring another complexity into init() - so:
            // let currentSong = this.index; 
            let currentJokeIndex = outputJoke.dataset.index;

            if (direction === 'next') {
                if (currentJokeIndex < jokes.length - 1) currentJokeIndex++;
                else currentJokeIndex = 0;
            } else if (direction === 'prev') {
                if (currentJokeIndex > 0) currentJokeIndex--;
                else currentJokeIndex = jokes.length - 1;
            } else {
                console.error(`Invalid direction: ${direction}`);
            }

            // Display the content of the existing jokes (don't type),
            // otherwise instead the below lines - to type the joke
            // just call: jokes[currentJokeIndex].jokeType();
            const joke = jokes[currentJokeIndex];

            outputJoke.innerHTML = joke.joke;
            outputJoke.style.fontSize = `${joke.fontSize}px`;

            joke.displayVisibleData();
            joke.fitJokeToContainer();
            joke.generateImage();
        } else {
            this.newJoke();
        }
    }
}

// Autoplay switch
function autoplayOnOff(event) {
    const { autoplaySwitch } = nodes;

    // The default value is on
    if (localStorage.getItem('autoPlayOnOff') === null) {
        localStorage.setItem('autoPlayOnOff', 'on');
    }

    // On click change the value
    if (event && event.target === autoplaySwitch) {
        if (localStorage.getItem('autoPlayOnOff') === 'off') {
            localStorage.setItem('autoPlayOnOff', 'on');
        } else if (localStorage.getItem('autoPlayOnOff') === 'on') {
            localStorage.setItem('autoPlayOnOff', 'off');
        } else {
            localStorage.setItem('autoPlayOnOff', 'on');
        }

        // Play sound
        typewriter.switch.audio.play();
    }

    // Read the value and change the state
    if (localStorage.getItem('autoPlayOnOff') === 'off') {
        autoplaySwitch.classList.replace('switch-on', 'switch-off');
    } else if (localStorage.getItem('autoPlayOnOff') === 'on') {
        autoplaySwitch.classList.replace('switch-off', 'switch-on');
    }
}
nodes.autoplaySwitch.addEventListener('click', autoplayOnOff);

// Image switch
function saveAsImageOnOff(event) {
    const { imageSwitch, outputJokeImageLink } = nodes;

    // The default value is on
    if (localStorage.getItem('imageOnOff') === null) {
        localStorage.setItem('imageOnOff', 'on');
    }

    // On click change the value
    if (event && event.target === imageSwitch) {
        if (localStorage.getItem('imageOnOff') === 'off') {
            localStorage.setItem('imageOnOff', 'on');
        } else if (localStorage.getItem('imageOnOff') === 'on') {
            localStorage.setItem('imageOnOff', 'off');
        } else {
            localStorage.setItem('imageOnOff', 'on');
        }

        // Play sound
        typewriter.switch.audio.play();
    }

    // Read the value and change the state
    if (localStorage.getItem('imageOnOff') === 'off') {
        imageSwitch.classList.replace('switch-on', 'switch-off');
        outputJokeImageLink.classList.add('hidden');
    } else if (localStorage.getItem('imageOnOff') === 'on') {
        imageSwitch.classList.replace('switch-off', 'switch-on');
        outputJokeImageLink.classList.remove('hidden');

        // If the image is not loaded yet, load it
        if (newJokeButton.resolve) {
            const currentJokeIndex = nodes.outputJoke.dataset.index;

            if (currentJokeIndex) {
                const joke = Joke.jokeList[currentJokeIndex];

                if (joke.image !== outputJokeImageLink.href) {
                    setTimeout(() => { joke.generateImage(); }, 300);
                }
            }
        }
    }
}
nodes.imageSwitch.addEventListener('click', saveAsImageOnOff);

// Sound switch
function soundOnOff(event) {
    const { soundSwitch } = nodes;

    // The default value is off
    if (localStorage.getItem('soundOnOff') === null) {
        localStorage.setItem('soundOnOff', 'on');
    }

    // On click, change the value
    if (event && event.target === soundSwitch) {
        if (localStorage.getItem('soundOnOff') === 'off') {
            localStorage.setItem('soundOnOff', 'on');
        } else if (localStorage.getItem('soundOnOff') === 'on') {
            localStorage.setItem('soundOnOff', 'off');
        } else {
            localStorage.setItem('soundOnOff', 'off');
        }

        // Play sound
        typewriter.switch.audio.play();
    }

    // Read the value and change the state
    if (localStorage.getItem('soundOnOff') === 'off') {
        soundSwitch.classList.replace('switch-on', 'switch-off');
        typewriter.soundOnOff();
    } else if (localStorage.getItem('soundOnOff') === 'on') {
        soundSwitch.classList.replace('switch-off', 'switch-on');
        typewriter.soundOnOff();
    }
}
nodes.soundSwitch.addEventListener('click', soundOnOff);

// The main logic
(async function init() {
    // Read and apply the user's settings
    autoplayOnOff();
    soundOnOff();
    saveAsImageOnOff();

    // Load the necessary sound effects
    typewriter.fetch('switch');
    typewriter.fetch('takeShot');

    // The main function
    nodes.btnShow.addEventListener('click', () => { Joke.newJoke(); });

    nodes.btnRight.addEventListener('click', (e) => {
        Joke.changeJoke('next');
    });

    nodes.btnLeft.addEventListener('click', (e) => {
        Joke.changeJoke('prev');
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') Joke.changeJoke('next');
        if (e.key === 'ArrowLeft') Joke.changeJoke('prev');
        if (e.key === ' ') Joke.newJoke();
    });
})();